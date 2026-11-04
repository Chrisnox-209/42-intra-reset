import assert from "node:assert/strict";
import test from "node:test";
import { cleanIntra, clearCookies, cookieRemovalDetails, isTargetCookie, isTargetUrl, ORIGINS } from "../cleaner.js";

const cookie = (overrides = {}) => ({
  domain: "profile.intra.42.fr", hostOnly: true, name: "session", path: "/", storeId: "0", ...overrides,
});

test("les URL proches, ports et protocoles étrangers restent exclus", () => {
  for (const value of ["https://intra.42.fr/", "https://profile.intra.42.fr/users/me", "http://profile.intra.42.fr/"]) {
    assert.equal(isTargetUrl(value), true, value);
  }
  for (const value of [undefined, "garbage", "https://intra.42.fr.evil.test/", "https://other.42.fr/", "https://42.fr/", "https://api.intra.42.fr/", "https://intra.42.fr:8443/", "ftp://intra.42.fr/"]) {
    assert.equal(isTargetUrl(value), false, String(value));
  }
});

test("seuls les cookies utilisables par les deux hôtes sont ciblés", () => {
  for (const entry of [cookie(), cookie({ domain: ".42.fr", hostOnly: false }), cookie({ domain: ".intra.42.fr", hostOnly: false })]) {
    assert.equal(isTargetCookie(entry), true);
  }
  for (const entry of [cookie({ domain: "42.fr" }), cookie({ domain: "other.42.fr" }), cookie({ domain: ".api.intra.42.fr", hostOnly: false }), cookie({ domain: "intra.42.fr.evil.test" })]) {
    assert.equal(isTargetCookie(entry), false);
  }
});

test("la suppression conserve chemin, magasin et partition sans viser le site parent", () => {
  const partitionKey = { topLevelSite: "https://example.org", hasCrossSiteAncestor: true };
  assert.deepEqual(cookieRemovalDetails(cookie({ domain: ".42.fr", hostOnly: false, path: "/auth", partitionKey })), {
    url: "https://intra.42.fr/auth", name: "session", storeId: "0", partitionKey,
  });
  assert.throws(() => cookieRemovalDetails(cookie({ domain: "other.42.fr" })));
});

function mockApi({ failStorage = false, failCookies = false, changeTab = false, failInjection = false } = {}) {
  const events = [];
  let cookies = [cookie(), cookie({ domain: ".42.fr", hostOnly: false }), cookie({ domain: "other.42.fr" })];
  let current = { id: 7, url: "https://profile.intra.42.fr/users/me", status: "complete", incognito: false };
  let reads = 0;
  const listener = () => ({ addListener() {}, removeListener() {} });
  const api = {
    runtime: { getURL: (path) => `chrome-extension://test/${path}` },
    cookies: {
      getAll: async (options) => {
        assert.deepEqual(options, { domain: "42.fr", partitionKey: {} });
        return [...cookies];
      },
      remove: async (details) => {
        events.push({ type: "cookie", details });
        if (failCookies) return undefined;
        const index = cookies.findIndex((entry) => isTargetCookie(entry));
        if (index < 0) return undefined;
        cookies.splice(index, 1);
        return details;
      },
    },
    tabs: {
      query: async () => [current, { id: 8, url: "https://other.42.fr/" }, { id: 9, url: "https://profile.intra.42.fr/", incognito: true }],
      get: async () => {
        reads += 1;
        if (changeTab && reads > 1) current = { ...current, url: "https://example.org/" };
        return current;
      },
      update: async (id, change) => {
        events.push({ type: "navigate", id, url: change.url });
        current = { ...current, url: change.url, status: "complete" };
        return current;
      },
      onUpdated: listener(),
      onRemoved: listener(),
    },
    scripting: { executeScript: async () => {
      events.push({ type: "session" });
      if (failInjection) throw new Error("No document");
      return [{ result: { targeted: true, errors: [] } }];
    } },
    browsingData: { remove: async (options, types) => {
      events.push({ type: "storage", options, types });
      if (failStorage) throw new Error("Unavailable");
    } },
  };
  return { api, events, remaining: () => cookies };
}

test("nettoyage limité aux origines, pages suspendues avant suppression puis rouvertes", async () => {
  const { api, events, remaining } = mockApi();
  const result = await cleanIntra(api);
  assert.equal(result.state, "success");
  assert.equal(result.cookiesRemoved, 2);
  assert.equal(result.tabsReopened, 1);
  assert.deepEqual(events.map((entry) => entry.type), ["session", "navigate", "storage", "cookie", "cookie", "navigate"]);
  const storage = events.find((entry) => entry.type === "storage");
  assert.deepEqual(storage.options.origins, ORIGINS);
  assert.equal(storage.options.since, 0);
  assert.equal(storage.options.originTypes.extension, false);
  assert.deepEqual(Object.keys(storage.types).sort(), ["cache", "cacheStorage", "fileSystems", "indexedDB", "localStorage", "serviceWorkers", "webSQL"].sort());
  assert.equal(remaining()[0].domain, "other.42.fr");
  assert.equal(events.at(-1).url, "https://profile.intra.42.fr/users/me");
});

test("une erreur de cache n’empêche pas les cookies ni la réouverture", async () => {
  const { api, events } = mockApi({ failStorage: true });
  const result = await cleanIntra(api);
  assert.equal(result.state, "warning");
  assert.equal(result.cookiesCleared, true);
  assert.equal(result.storageCleared, false);
  assert.equal(events.at(-1).url, "https://profile.intra.42.fr/users/me");
});

test("les cookies restants produisent un échec explicite", async () => {
  const { api } = mockApi({ failCookies: true });
  await assert.rejects(clearCookies(api), /encore présents/);
});

test("un stockage de session inaccessible produit un résultat partiel", async () => {
  const { api } = mockApi({ failInjection: true });
  const result = await cleanIntra(api);
  assert.equal(result.state, "warning");
  assert.equal(result.cookiesCleared, true);
  assert.equal(result.storageCleared, true);
  assert.match(result.warnings.join(" "), /session/);
});

test("un onglet réutilisé par l’utilisateur n’est pas redirigé", async () => {
  const { api, events } = mockApi({ changeTab: true });
  const result = await cleanIntra(api);
  assert.equal(result.tabsReopened, 0);
  assert.equal(events.filter((entry) => entry.type === "navigate").length, 1);
});

test("l’indisponibilité de l’affichage de progression n’interrompt pas la suppression", async () => {
  const { api } = mockApi();
  const result = await cleanIntra(api, async () => { throw new Error("Popup closed"); });
  assert.equal(result.state, "success");
  assert.equal(result.tabsReopened, 1);
});
