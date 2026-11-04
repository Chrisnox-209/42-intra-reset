import assert from "node:assert/strict";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const moduleUrl = process.env.PLAYWRIGHT_MODULE
  ? pathToFileURL(resolve(process.env.PLAYWRIGHT_MODULE)).href : "playwright";
const { chromium } = await import(moduleUrl);
const source = fileURLToPath(new URL("../", import.meta.url));
const testRoot = await mkdtemp(join(tmpdir(), "42-reset-test-"));
const profile = join(testRoot, "profile");
const extension = join(testRoot, "extension");
let context;
try {
  await mkdir(extension);
  for (const file of ["background.js", "cleaner.js", "toolbar.js", "reset.html", "style.css", "icons"]) {
    await cp(join(source, file), join(extension, file), { recursive: true });
  }
  // Static imports are required in extension service workers. This test-only
  // wrapper exposes the real handler without adding a production message API.
  const manifest = JSON.parse(await readFile(join(source, "manifest.json"), "utf8"));
  manifest.background.service_worker = "test-driver.js";
  await writeFile(join(extension, "manifest.json"), JSON.stringify(manifest));
  await writeFile(join(extension, "test-driver.js"), 'import { beginCleanup } from "./background.js"; globalThis.testBeginCleanup = beginCleanup;');
  context = await chromium.launchPersistentContext(profile, {
    headless: true,
    ignoreDefaultArgs: ["--disable-extensions"],
    ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : { channel: "chromium" }),
    args: [
      `--disable-extensions-except=${extension}`,
      `--load-extension=${extension}`,
      "--no-sandbox", "--disable-background-networking", "--no-default-browser-check",
    ],
  });
  // Synthetic responses only: no request to 42 or another real website.
  await context.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (url.protocol === "chrome-extension:") return route.continue();
    if (["intra.42.fr", "profile.intra.42.fr", "other.42.fr", "example.org"].includes(url.hostname)) {
      return route.fulfill({ contentType: "text/html", body: "<!doctype html><html><title>Test local 42 Reset</title><body>Fixture locale, sans réseau.</body></html>" });
    }
    return route.abort();
  });
  const worker = context.serviceWorkers().find((worker) => worker.url().endsWith("/test-driver.js")) ??
    await context.waitForEvent("serviceworker", { predicate: (worker) => worker.url().endsWith("/test-driver.js"), timeout: 15000 });
  console.log("Extension chargée dans le profil temporaire.");
  const errors = [];
  context.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  context.on("weberror", (error) => errors.push(error.error().message));
  const actionState = await worker.evaluate(async () => ({
    popup: await chrome.action.getPopup({}),
    clickHandler: chrome.action.onClicked.hasListeners(),
  }));
  assert.deepEqual(actionState, { popup: "", clickHandler: true });
  const intra = await context.newPage();
  const target = await context.newPage();
  const unrelated = await context.newPage();
  await intra.goto("https://intra.42.fr/");
  await target.goto("https://profile.intra.42.fr/users/me");
  await unrelated.goto("https://other.42.fr/");
  for (const page of [intra, target, unrelated]) {
    await page.evaluate(async () => {
      localStorage.setItem("test-local", "present");
      sessionStorage.setItem("test-session", "present");
      const cache = await caches.open("test-cache");
      await cache.put("/test-resource", new Response("cached"));
      await new Promise((resolve, reject) => {
        const request = indexedDB.open("test-db", 1);
        request.onupgradeneeded = () => request.result.createObjectStore("test-store");
        request.onsuccess = () => { request.result.close(); resolve(); };
        request.onerror = () => reject(request.error);
      });
    });
  }
  await context.addCookies([
    { name: "host", value: "test", url: "https://profile.intra.42.fr/", httpOnly: true, secure: true },
    { name: "same", value: "test", domain: "profile.intra.42.fr", path: "/", secure: true },
    { name: "same", value: "test", domain: ".intra.42.fr", path: "/", secure: true },
    { name: "same", value: "test", domain: ".42.fr", path: "/", secure: true },
    { name: "path", value: "test", domain: "profile.intra.42.fr", path: "/users", secure: true },
    { name: "keep-sibling", value: "test", url: "https://other.42.fr/" },
    { name: "keep-parent", value: "test", url: "https://42.fr/" },
    { name: "keep-external", value: "test", url: "https://example.org/" },
  ]);
  await worker.evaluate(async () => {
    await chrome.cookies.set({
      url: "https://profile.intra.42.fr/", name: "partitioned", value: "test", secure: true,
      sameSite: "no_restriction", partitionKey: { topLevelSite: "https://example.org", hasCrossSiteAncestor: true },
    });
  });
  const pagesBefore = context.pages().length;
  console.log("Données de test créées ; nettoyage sans popup déclenché.");
  const result = await worker.evaluate(async () => {
    globalThis.testIconUpdates = [];
    const originalSetIcon = chrome.action.setIcon.bind(chrome.action);
    chrome.action.setIcon = (details) => {
      const image = details.imageData?.[32];
      const hash = image ? image.data.reduce((sum, value, index) => (sum + value * (index + 1)) >>> 0, 0) : null;
      globalThis.testIconUpdates.push({ type: image ? "frame" : "static", hash });
      return originalSetIcon(details);
    };
    const originalRemove = chrome.browsingData.remove.bind(chrome.browsingData);
    chrome.browsingData.remove = async (...args) => {
      // Hold only the synthetic test long enough to observe several frames.
      await new Promise((resolve) => setTimeout(resolve, 300));
      return originalRemove(...args);
    };
    const job = globalThis.testBeginCleanup();
    if (globalThis.testBeginCleanup() !== job) throw new Error("Les clics simultanés ne sont pas regroupés.");
    return job;
  });
  assert.equal(result.state, "success", JSON.stringify(result));
  assert.equal(result.tabsReopened, 2);
  assert.equal(context.pages().length, pagesBefore, "Aucun nouvel onglet ne doit être ouvert.");
  const iconState = await worker.evaluate(async () => {
    const finishedLength = globalThis.testIconUpdates.length;
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      updates: globalThis.testIconUpdates,
      stopped: finishedLength === globalThis.testIconUpdates.length,
      title: await chrome.action.getTitle({}),
      badge: await chrome.action.getBadgeText({}),
    };
  });
  const frames = iconState.updates.filter((update) => update.type === "frame");
  assert.ok(new Set(frames.map((frame) => frame.hash)).size > 1, "Le cercle doit tourner.");
  assert.equal(iconState.updates.at(-1).type, "static", "Le 42 doit revenir en fin d’opération.");
  assert.equal(iconState.stopped, true);
  assert.equal(iconState.badge, "");
  assert.match(iconState.title, /terminé/);
  await target.waitForURL("https://profile.intra.42.fr/users/me");
  await target.waitForLoadState();
  await intra.waitForURL("https://intra.42.fr/");
  await intra.waitForLoadState();
  for (const page of [intra, target]) {
    const data = await page.evaluate(async () => ({
      local: localStorage.length, session: sessionStorage.length,
      caches: await caches.keys(), databases: (await indexedDB.databases()).map((db) => db.name),
    }));
    assert.deepEqual(data, { local: 0, session: 0, caches: [], databases: [] });
  }
  const preserved = await unrelated.evaluate(async () => ({
    local: localStorage.getItem("test-local"), session: sessionStorage.getItem("test-session"),
    caches: await caches.keys(), databases: (await indexedDB.databases()).map((db) => db.name),
  }));
  assert.deepEqual(preserved, { local: "present", session: "present", caches: ["test-cache"], databases: ["test-db"] });
  const remaining = await context.cookies();
  assert.deepEqual(remaining.map((cookie) => cookie.name).sort(), ["keep-external", "keep-parent", "keep-sibling"]);
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ browser: context.browser()?.version(), result, preservedSites: true, noPopup: true, noNewTabs: true, spinnerFrames: frames.length, spinnerStopped: iconState.stopped, remainingCookieNames: remaining.map((cookie) => cookie.name) }, null, 2));
} finally {
  if (context) await context.close();
  await rm(testRoot, { recursive: true, force: true });
}
