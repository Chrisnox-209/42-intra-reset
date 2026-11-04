const ICON_PATHS = Object.freeze(Object.fromEntries(
  [16, 32, 48, 128].map((size) => [size, `icons/icon-${size}.png`]),
));

function spinnerFrame(frame) {
  const images = {};
  for (const size of [16, 32]) {
    const canvas = new OffscreenCanvas(size, size);
    const context = canvas.getContext("2d");
    context.fillStyle = "#000000";
    context.fillRect(0, 0, size, size);
    context.lineWidth = size * 0.12;
    context.lineCap = "round";
    for (let segment = 0; segment < 12; segment += 1) {
      const angle = (segment + frame) * Math.PI / 6 - Math.PI / 2;
      context.strokeStyle = `rgba(255, 255, 255, ${(segment + 1) / 12})`;
      context.beginPath();
      context.arc(size / 2, size / 2, size * 0.34, angle, angle + Math.PI / 12);
      context.stroke();
    }
    images[size] = context.getImageData(0, 0, size, size);
  }
  return images;
}

export function startIconAnimation(action) {
  const frames = Array.from({ length: 12 }, (_, frame) => spinnerFrame(frame));
  let frame = 0;
  let stopped = false;
  let timer;
  let pending = Promise.resolve();

  async function tick() {
    pending = action.setIcon({ imageData: frames[frame] });
    try { await pending; } catch { return; }
    frame = (frame + 1) % frames.length;
    if (!stopped) timer = setTimeout(tick, 80);
  }
  void tick();

  return async () => {
    stopped = true;
    clearTimeout(timer);
    await pending.catch(() => {});
    await action.setIcon({ path: { ...ICON_PATHS } }).catch(() => {});
  };
}
