# 42 Reset — English guide

[Home](README.md) · [Français](README.fr.md) · **English** · [Español](README.es.md)

**Version 1.1.1 — Desktop extension for Brave and Google Chrome.**

42 Reset clears cookies, cache, and local storage for the 42 Intra in one click, then reloads affected tabs that are already open. Its icon is a **black square with a white “42”**. A **white spinner rotates inside the icon** during cleaning, without a popup or a new window.

## The problem behind this project

The extension was created for a recurring problem: the profile at `https://profile.intra.42.fr/` becomes inaccessible, and clearing the website’s browser data is needed before trying again.

Expired login cookies, cached resources, or local storage that no longer matches an updated website can contribute to this kind of issue. **The exact cause of the original problem has not been diagnosed.**

42 Reset automates the cleanup procedure. Instead of finding data for both websites in the browser settings every time the problem occurs, you click a single icon.

## What the extension can help resolve

It can help when faulty access to the Intra or profile is caused by data stored locally in the browser. It resets local website data for both sites and reloads their pages so they can start with fresh data.

It does not fix an outage on 42’s servers, a network or DNS problem, access denied by 42, or an account-specific issue. If cleaning succeeds but the profile remains inaccessible, the cause may be elsewhere. It also cannot guarantee that the problem will never return.

## Compatibility

The extension uses Manifest V3 and standard Chrome APIs. Its browser code does not depend on any program specific to Linux, Windows, or macOS.

| Browser | Linux | Windows | macOS |
| --- | --- | --- | --- |
| Desktop Brave | Tested in a temporary profile | Expected compatibility; not directly tested | Expected compatibility; not directly tested |
| Desktop Google Chrome | Expected compatibility; not directly tested | Expected compatibility; not directly tested | Expected compatibility; not directly tested |

Requirements:

- Google Chrome **132 or later**, or a Brave version based on **Chromium 132 or later**.
- An operating system supported by the browser version you use.
- Permission to load a local extension in developer mode. A browser managed by a school or company may block this installation.

The same archive is intended for all three systems, with no compilation required. **You do not need Node.js or Python to install or use the extension.** This package does not target Safari, Firefox, or mobile browsers.

Google documents [loading local extensions on Windows, Mac, and Linux](https://support.google.com/chrome/a/answer/2714278?hl=en), and Brave uses the [Chrome extension system](https://brave.com/learn/using-chrome-extensions-in-brave/). The expected compatibility above is inferred from those mechanisms and the code; it does not replace testing on each platform.

## Installation

### 1. Prepare the folder

If you received `42-reset-brave.zip`, extract it first. Although the ZIP filename mentions Brave, its contents are also intended for Chrome.

Place the extracted `42-reset` folder somewhere permanent on your computer. If you are using the project source directly, use the project folder instead.

The folder to load must directly contain `manifest.json`, `background.js`, `cleaner.js`, `toolbar.js`, and the `icons` folder. Select **that folder**, rather than the ZIP file or its parent folder. Do not move or delete it after installation: the browser uses its files.

### 2. Load the extension

1. Open the browser and the profile where you use the Intra.
2. Enter the appropriate address in the browser’s address bar:

   | Browser | Address |
   | --- | --- |
   | Brave | `brave://extensions` |
   | Google Chrome | `chrome://extensions` |

3. Enable **Developer mode**, usually in the top-right corner.
4. Click **Load unpacked**. The button label may differ if the browser uses another language.
5. Select the folder containing `manifest.json` and confirm.
6. Check that **42 Reset — Débloquer l’Intra** appears in the list and is enabled.

These steps are the same on Linux, Windows, and macOS; only the folder picker differs. This is a local installation: the extension is not published on the Chrome Web Store.

### 3. Pin the icon

Open the extensions menu, usually shown as a puzzle piece next to the address bar, and pin **42 Reset**. The black square with the **white 42** will then be accessible from the toolbar.

**Installing or reloading the extension does not start a cleanup. You must click its icon.**

## Everyday use

1. Save any work or text you are entering on the Intra pages: they will be reloaded.
2. When your profile stops opening, or you want to reset its local data, click the 42 icon **once**.
3. A white spinner rotates on the black square during cleaning. The cleanup creates no popup, new window, or new tab.
4. Tabs already open on the two websites briefly show a waiting page in their existing tab, then return to their original address.
5. Once the white 42 returns, hover over the icon to read the result. Sign in to 42 again if the website asks you to.

Cleaning can take several seconds. Additional clicks while an operation is running do not start concurrent cleanups.

You can also click from another website or when no Intra tab is open. Cleaning still runs; afterward, open the [Intra](https://intra.42.fr/) or [your profile](https://profile.intra.42.fr/) yourself. The extension does not automatically open the profile in a new tab.

### Understanding the indicators

| Display | Meaning | Action |
| --- | --- | --- |
| Black square with a white 42 | Idle, or the operation has finished | Hover over the icon to read its status |
| Rotating white circle | Cleaning is in progress | Wait for it to finish |
| Small `!` badge, white on black | Cleaning was incomplete or interrupted | Read the tooltip, then click to retry |

The extension’s messages and waiting page are currently in French. The three languages apply to this documentation.

## What gets cleared and where

The targeted origins are `https://intra.42.fr`, `https://profile.intra.42.fr`, and their HTTP equivalents on standard ports. Storage for other subdomains is not automatically included.

| Data | Treatment |
| --- | --- |
| Cookies usable by the two hosts | Targeted removal, including HttpOnly cookies, partitioned cookies, and cookies with different paths |
| Shared `.intra.42.fr` and `.42.fr` cookies | Removed when they apply to either target host |
| HTTP cache and Cache Storage | Cleared for the targeted origins |
| localStorage and IndexedDB | Cleared for the targeted origins |
| Website file systems and service workers | Cleared for the targeted origins; WebSQL removal is also requested if the browser still supports it |
| sessionStorage | Cleared in accessible documents of Intra tabs open when you click |

**Shared `.42.fr` cookies may be used by several services, so deleting them may also sign you out of other 42 services.** Cookies specific to another host, such as `other.42.fr`, are preserved. Cookies are removed individually to avoid clearing every cookie across the entire domain.

Session storage for tabs that have already been closed or discarded by the browser, and for Intra iframes embedded in other websites, is not guaranteed to be cleared. An inaccessible page or document may lead to a partial result.

Cleaning applies only to the **browser profile where the extension is installed**, outside private/incognito browsing. It does not clean other profiles, another browser, or other devices.

## Effects to be aware of

- Intra pages are reloaded, so unsaved input may be lost.
- You may need to sign in again. Some website preferences or offline data may be removed.
- Passwords saved in the browser’s password manager, browsing history, bookmarks, downloaded files, and website permissions are preserved.
- The extension does not delete your account, projects, or progress on 42’s servers.
- Websites can create cookies and cache normally after cleaning. Seeing them again does not mean the operation failed.
- The extension has no undo function for deleted local data.

## Troubleshooting

| Situation | What to do |
| --- | --- |
| The load button is missing | Check Developer mode. If the browser is managed, ask the administrator whether local extensions are allowed. |
| The browser cannot find the manifest | Extract the ZIP and select the folder that directly contains `manifest.json`. |
| The icon is missing from the toolbar | Check that the extension is enabled, then pin it from the extensions menu. |
| A `!` badge appears | Hover over the icon to read the details, close other 42 pages if cookies are being recreated, then retry. |
| The spinner or waiting page stays visible | Allow a little time. If the operation appears stuck, reload the extension from the extensions page, retry, and reopen the profile manually if necessary. |
| The website asks you to sign in | This is an expected effect of deleting session cookies. Sign in normally. |
| Cleaning succeeds but the profile remains inaccessible | Check website and network access; a service or account incident may require help from 42 support. |
| The problem returns later | Run the cleanup again. The extension automates a local reset without permanently fixing the underlying issue. |

## Updating and uninstalling

To update:

1. Replace the installed folder’s files with the new version, keeping the same location.
2. Open `brave://extensions` or `chrome://extensions`.
3. Click **Reload** on the 42 Reset card. Reloading alone does not delete website data.

To disable the extension temporarily, use its toggle on the same page. To uninstall it, click **Remove** and confirm in the browser. You can then delete its folder if you no longer need it. Uninstalling does not restore previously cleared data.

## Privacy and permissions

There is no account to create, telemetry, collection server, or remote library. The code does not log or retain cookie values. Progress and the latest cleanup result are kept in memory using `chrome.storage.session` until the browser session ends.

Reloading the pages triggers their usual requests to 42, just as normal browsing would.

| Permission | Purpose in this extension |
| --- | --- |
| `cookies` | Find and remove the targeted cookies |
| `browsingData` | Clear cache and storage using a fixed origin list; this permission is technically broad, but the code does not perform a global cleanup |
| `scripting` | Clear session storage in accessible Intra pages |
| `storage` | Keep progress and the result in memory |
| Access to `intra.42.fr` and `profile.intra.42.fr` | Work with those two hosts without requesting access to all websites |

## For developers

The full source folder includes scripts and tests; the installation archive contains only the extension and its documentation.

With Node.js, npm, and Python 3 available, run these commands from the source folder:

```sh
npm test
npm run pack
```

The first command runs the logic tests. The second creates `dist/42-reset-brave.zip`, which can be used in Brave or Chrome after extraction. These commands do not require `npm install`.

The optional integration test, `scripts/test-browser.mjs`, requires Playwright and an installed browser. It uses a temporary profile and simulated website responses, leaving the personal profile untouched. The `PLAYWRIGHT_MODULE` and `BROWSER_EXECUTABLE` environment variables specify their paths. Behavior has been verified in Brave on Linux: clearing storage and cookies, preserving unrelated data, reloading existing tabs, and running the animation without a popup or a new tab. This does not diagnose the real website.

The optional `scripts/generate-icons.py` script requires Pillow. Its default font path is for Linux and must be adjusted on another system to regenerate the icons. The supplied PNG files work without this script.

## References

- [Load a local extension in Chrome](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world)
- [Minimum Chrome version in the manifest](https://developer.chrome.com/docs/extensions/reference/manifest/minimum-chrome-version)
- [browsingData API](https://developer.chrome.com/docs/extensions/reference/api/browsingData)
- [cookies API](https://developer.chrome.com/docs/extensions/reference/api/cookies)
- [action API: toolbar icon and button](https://developer.chrome.com/docs/extensions/reference/api/action)
