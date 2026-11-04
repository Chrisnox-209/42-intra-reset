import { cleanIntra } from "./cleaner.js";
import { startIconAnimation } from "./toolbar.js";

let currentJob;

async function setStatus(status) {
  let title = "42 Reset — Nettoyage terminé. Clique pour nettoyer à nouveau.";
  if (status.state === "running") title = `42 Reset — ${status.message}`;
  if (status.state === "warning") title = `42 Reset — ${status.warnings.join(" ")} Clique pour réessayer.`;
  // Feedback must not interrupt cleaning if one of the UI APIs is unavailable.
  await Promise.allSettled([
    chrome.storage.session.set({ cleanupStatus: status }),
    chrome.action.setTitle({ title }),
  ]);
}

export function beginCleanup() {
  if (currentJob) return currentJob;
  currentJob = (async () => {
    const stopAnimation = startIconAnimation(chrome.action);
    let result;
    try {
      await chrome.action.setBadgeText({ text: "" });
      await setStatus({ state: "running", message: "Démarrage du nettoyage…" });
      result = await cleanIntra(chrome, (message) => setStatus({ state: "running", message }));
    } catch {
      result = {
        state: "warning",
        warnings: ["Le nettoyage a été interrompu."],
      };
    } finally {
      // Wait for any in-flight frame before restoring the static 42 icon.
      await stopAnimation();
    }
    await setStatus(result);
    await chrome.action.setBadgeBackgroundColor({ color: "#000000" });
    await chrome.action.setBadgeTextColor({ color: "#ffffff" });
    await chrome.action.setBadgeText({ text: result.state === "success" ? "" : "!" });
    return result;
  })().finally(() => { currentJob = undefined; });
  return currentJob;
}

// No popup or extra tab: a toolbar click runs the cleanup in the background.
chrome.action.onClicked.addListener(() => {
  void beginCleanup().catch(() => {});
});
