"""Render the extension's typographic icon: white 42 in a black square."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parent.parent / "icons"
root.mkdir(exist_ok=True)
font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
for size in (16, 32, 48, 128):
    scale = 4
    side = size * scale
    image = Image.new("RGBA", (side, side), (0, 0, 0, 255))
    draw = ImageDraw.Draw(image)
    font = ImageFont.truetype(font_path, round(side * 0.69))
    bounds = draw.textbbox((0, 0), "42", font=font)
    position = ((side - bounds[2] - bounds[0]) / 2, (side - bounds[3] - bounds[1]) / 2)
    draw.text(position, "42", font=font, fill=(255, 255, 255, 255))
    image.resize((size, size), Image.Resampling.LANCZOS).save(root / f"icon-{size}.png")
