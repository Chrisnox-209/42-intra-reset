# 42 Reset

[Home](README.md) · [Français](README.fr.md) · **English** · [Español](README.es.md)

## What is it for?

Sometimes your 42 profile will not open. Clearing the website’s data in your browser can help it work again.

42 Reset does this in one click for these two websites:

- [42 Intra](https://intra.42.fr/)
- [42 profile](https://profile.intra.42.fr/)

Your browser saves files to load pages faster. These saved files are called the **cache**. It also saves small pieces of information called **cookies**, which can help keep you signed in.

If this saved data causes a problem, the extension clears it so the websites can start fresh. It cannot fix a problem with 42’s servers or your Internet connection.

## How to install it

1. Download the project. If you have a ZIP file, extract it into a folder you will keep on your computer.
2. Open Brave or Google Chrome.
3. In the address bar, type `brave://extensions` for Brave or `chrome://extensions` for Chrome.
4. Turn on **Developer mode** in the top-right corner.
5. Click **Load unpacked**.
6. Select the folder that contains the `manifest.json` file.
7. In the extensions menu near the address bar, pin **42 Reset** so you can easily find its button.

Keep the folder in the same place after installation. The browser needs it to run the extension.

## How to use it

1. Save anything you are writing on the Intra, because its pages will reload.
2. Click the **42 Reset** button once.
3. Wait for the cleanup to finish. Intra pages that are already open will reload automatically.
4. Sign in to 42 again if the website asks you to.

If no Intra page was open, open your profile after cleaning.

If a **!** appears on the button, the cleanup did not finish properly. Hold your mouse over the button to read the message, then click to try again.

## What does it delete?

The extension clears cookies, cache, and other data that these two websites saved in your browser.

This may sign you out of the Intra and other 42 services that share the same cookies. Some website settings may also be forgotten.

Passwords saved in your browser, bookmarks, and browsing history are kept. Your account, projects, and progress on 42’s servers stay in place.

Cleaning applies to the browser and profile where the extension is installed. It does not work in private or incognito mode.

## Which computers can use it?

Use a recent desktop version of Brave or Google Chrome. The project is designed for Linux, Windows, and macOS. So far, it has been tested in Brave on Linux.

## If it still does not work

- If the browser cannot find the extension, make sure you selected the folder containing `manifest.json`, rather than the ZIP file.
- If cleaning seems stuck, go back to the extensions page, click **Reload** for 42 Reset, and try again.
- If your profile still will not open after cleaning, check your Internet connection. You can also ask 42 support for help.

The website can save new data when you return. This is normal. If the problem comes back, you can run the cleanup again.

## Updating or removing it

To update the extension, replace its files in the same folder, then click **Reload** on the extensions page.

To uninstall it, click **Remove** on that page.
