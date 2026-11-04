# 42 Reset

**Brave & Google Chrome · Desktop · Version 1.1.1**

| Langue / Language / Idioma | Documentation complète / Full guide / Guía completa |
| --- | --- |
| Français | [Installation, utilisation, problème traité et dépannage](README.fr.md) |
| English | [Installation, usage, the problem addressed, and troubleshooting](README.en.md) |
| Español | [Instalación, uso, problema que aborda y solución de problemas](README.es.md) |

**FR —** Un clic pour effacer les cookies, le cache et les données locales de l’Intra 42, puis recharger les pages déjà ouvertes. Carré noir, 42 blanc, cercle de chargement dans l’icône. Sans popup ni nouvel onglet.

**EN —** One click clears cookies, cache, and local data for the 42 Intra, then reloads existing tabs. Black square, white 42, loading spinner inside the icon. No popup or new tab.

**ES —** Un clic borra cookies, caché y datos locales de la Intra de 42 y vuelve a cargar las pestañas abiertas. Cuadrado negro, 42 blanco y círculo de carga en el icono. Sin ventanas emergentes ni pestañas nuevas.

Sites / Sitios :

- [intra.42.fr](https://intra.42.fr/)
- [profile.intra.42.fr](https://profile.intra.42.fr/)

## Compatibility / Compatibilité / Compatibilidad

| Browser / Navigateur / Navegador | Linux | Windows | macOS |
| --- | --- | --- | --- |
| Brave | Tested / Testé / Probado | Expected, untested / Prévu, non testé / Previsto, sin probar | Expected, untested / Prévu, non testé / Previsto, sin probar |
| Google Chrome | Expected, untested / Prévu, non testé / Previsto, sin probar | Expected, untested / Prévu, non testé / Previsto, sin probar | Expected, untested / Prévu, non testé / Previsto, sin probar |

Chrome 132+ / Brave based on Chromium 132+. The same package is intended for all three desktop systems; see each guide for requirements and the scope of testing.

## Package

Generate the installable ZIP from the source repository with `npm run pack`. It is written to `dist/42-reset-brave.zip`; generated archives are excluded from Git. Despite its filename, the same extension is intended for both Brave and Chrome. Extract it before using **Load unpacked** in `brave://extensions` or `chrome://extensions`.

The complete guides explain the installation steps, what gets cleared, possible sign-outs, privacy, updates, and limitations. Cleaning local data may help when stale site data causes access problems; it does not repair a server, network, or account issue.
