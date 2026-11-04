export const HOSTS = Object.freeze(["intra.42.fr", "profile.intra.42.fr"]);
export const ORIGINS = Object.freeze(
  HOSTS.flatMap((host) => [`https://${host}`, `http://${host}`]),
);
export const MATCHES = Object.freeze(HOSTS.map((host) => `*://${host}/*`));

export function isTargetUrl(value) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) &&
      HOSTS.includes(url.hostname) && url.port === "";
  } catch {
    return false;
  }
}

export function isTargetCookie(cookie) {
  const domain = cookie.domain.replace(/^\./, "");
  return HOSTS.some((host) => host === domain ||
    (!cookie.hostOnly && host.endsWith(`.${domain}`)));
}

export function cookieRemovalDetails(cookie) {
  const domain = cookie.domain.replace(/^\./, "");
  // Use a target host, never the parent site: an unrelated host-only cookie on
  // 42.fr must not be selected when removing a shared .42.fr cookie.
  const host = HOSTS.find((candidate) => candidate === domain ||
    (!cookie.hostOnly && candidate.endsWith(`.${domain}`)));
  if (!host) throw new Error("Cookie hors du périmètre autorisé.");
  const url = new URL(`https://${host}`);
  url.pathname = cookie.path;
  return {
    url: url.href,
    name: cookie.name,
    storeId: cookie.storeId,
    ...(cookie.partitionKey ? { partitionKey: cookie.partitionKey } : {}),
  };
}

async function targetCookies(api) {
  // An empty partitionKey includes partitioned AND unpartitioned cookies.
  const cookies = await api.cookies.getAll({ domain: "42.fr", partitionKey: {} });
  return cookies.filter(isTargetCookie);
}

export async function clearCookies(api) {
  let removed = 0;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const cookies = await targetCookies(api);
    if (cookies.length === 0) return removed;
    for (const cookie of cookies) {
      const result = await api.cookies.remove(cookieRemovalDetails(cookie));
      if (result) removed += 1;
    }
  }
  if ((await targetCookies(api)).length > 0) {
    throw new Error("Des cookies sont encore présents. Ferme les autres pages 42 et réessaie.");
  }
  return removed;
}

// This function is serialized by chrome.scripting: keep it self-contained.
export function clearPageStorage(hosts) {
  if (!hosts.includes(location.hostname)) return { targeted: false };
  window.stop();
  const errors = [];
  for (const name of ["sessionStorage", "localStorage"]) {
    try {
      window[name].clear();
    } catch {
      errors.push(name);
    }
  }
  return { targeted: true, errors };
}

async function parkTab(api, tabId, resetUrl) {
  let timer;
  let onUpdated;
  let onRemoved;
  let resolveNavigation;
  let rejectNavigation;
  const navigation = new Promise((resolve, reject) => {
    resolveNavigation = resolve;
    rejectNavigation = reject;
  });
  // Register before navigating so fast extension-page loads cannot be missed.
  onUpdated = (id, change, tab) => {
    if (id === tabId && change.status === "complete" && tab.url === resetUrl) {
      resolveNavigation();
    }
  };
  onRemoved = (id) => {
    if (id === tabId) rejectNavigation(new Error("L’onglet a été fermé."));
  };
  api.tabs.onUpdated.addListener(onUpdated);
  api.tabs.onRemoved.addListener(onRemoved);
  timer = setTimeout(() => rejectNavigation(new Error("L’onglet ne répond pas.")), 15000);
  try {
    const tab = await api.tabs.update(tabId, { url: resetUrl });
    if (tab.status === "complete" && tab.url === resetUrl) resolveNavigation();
    await navigation;
  } catch (error) {
    // Avoid leaving a rejected navigation promise unobserved after update fails.
    resolveNavigation();
    await navigation.catch(() => {});
    throw error;
  } finally {
    clearTimeout(timer);
    api.tabs.onUpdated.removeListener(onUpdated);
    api.tabs.onRemoved.removeListener(onRemoved);
  }
}

export async function cleanIntra(api, report = async () => {}) {
  const warnings = [];
  const parked = [];
  let cookiesRemoved = 0;
  let storageCleared = false;
  let tabsReopened = 0;
  const progress = async (message) => {
    // Unavailable progress feedback must not interrupt cleanup.
    try { await report(message); } catch { /* Cleaning continues. */ }
  };
  const resetUrl = api.runtime.getURL("reset.html");
  const tabs = (await api.tabs.query({ url: [...MATCHES] }))
    .filter((tab) => !tab.incognito && isTargetUrl(tab.url));

  await progress("Préparation des pages ouvertes…");
  // Remove sessionStorage while its origin is still available, then unload the
  // pages so their scripts cannot recreate cookies/storage during deletion.
  for (const tab of tabs) {
    try {
      const current = await api.tabs.get(tab.id);
      if (!isTargetUrl(current.url) || current.incognito) continue;
      if (current.pendingUrl && !isTargetUrl(current.pendingUrl)) continue;
      const originalUrl = current.url;
      try {
        const results = await api.scripting.executeScript({
          target: { tabId: tab.id, allFrames: true },
          func: clearPageStorage,
          args: [[...HOSTS]],
        });
        if (!results.some(({ result }) => result?.targeted) ||
            results.some(({ result }) => result?.errors?.length)) {
          warnings.push("Le stockage de session d’un onglet n’a pas pu être entièrement vidé.");
        }
      } catch {
        warnings.push("Un onglet ne répondait pas : son stockage de session n’a pas pu être vérifié.");
      }
      // Remember before navigating, including when navigation times out.
      parked.push({ id: tab.id, url: originalUrl });
      await parkTab(api, tab.id, resetUrl);
    } catch {
      warnings.push("Un onglet n’a pas pu être mis en pause pendant le nettoyage.");
    }
  }

  await progress("Suppression du cache et des données locales…");
  try {
    // Do NOT use browsingData's cookies flag: it would delete every cookie on
    // the registrable domain, including unrelated services under 42.fr.
    await api.browsingData.remove({
      since: 0,
      origins: [...ORIGINS],
      originTypes: { unprotectedWeb: true, protectedWeb: true, extension: false },
    }, {
      cache: true,
      cacheStorage: true,
      fileSystems: true,
      indexedDB: true,
      localStorage: true,
      serviceWorkers: true,
      webSQL: true,
    });
    storageCleared = true;
  } catch {
    warnings.push("Le cache et les données locales n’ont pas pu être entièrement effacés.");
  }

  await progress("Suppression et vérification des cookies…");
  let cookiesCleared = false;
  try {
    cookiesRemoved = await clearCookies(api);
    cookiesCleared = true;
  } catch (error) {
    warnings.push(error.message || "Les cookies n’ont pas pu être entièrement effacés.");
  }

  await progress("Réouverture des pages Intra…");
  for (const tab of parked) {
    try {
      const current = await api.tabs.get(tab.id);
      // Do not hijack a tab the user has navigated somewhere else meanwhile.
      if (current.url === resetUrl && (!current.pendingUrl || current.pendingUrl === resetUrl)) {
        await api.tabs.update(tab.id, { url: tab.url });
        tabsReopened += 1;
      }
    } catch {
      // A tab intentionally closed by the user does not make cleaning fail.
    }
  }
  return {
    state: cookiesCleared && storageCleared && warnings.length === 0 ? "success" : "warning",
    cookiesRemoved,
    cookiesCleared,
    storageCleared,
    tabsReopened,
    warnings: [...new Set(warnings)],
    finishedAt: Date.now(),
  };
}
