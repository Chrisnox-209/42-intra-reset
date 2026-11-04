# 42 Reset — Guide en français

[Accueil](README.md) · **Français** · [English](README.en.md) · [Español](README.es.md)

**Version 1.1.1 — Extension pour Brave et Google Chrome sur ordinateur.**

42 Reset efface en un clic les cookies, le cache et le stockage local de l’Intra 42, puis recharge les pages concernées déjà ouvertes. Son icône est un **carré noir avec « 42 » en blanc**. Pendant le nettoyage, un **cercle blanc tourne dans l’icône**, sans popup ni nouvelle fenêtre.

## Le problème à l’origine du projet

L’extension a été créée pour un problème récurrent : le profil sur `https://profile.intra.42.fr/` devient inaccessible, et il faut effacer les données du site dans le navigateur avant de pouvoir réessayer.

Des cookies de connexion périmés, des ressources conservées en cache ou un stockage local devenu incompatible avec une mise à jour du site peuvent contribuer à ce type de dysfonctionnement. **La cause exacte du problème initial n’a pas été diagnostiquée.**

42 Reset automatise la manipulation de nettoyage : au lieu de rechercher les données des deux sites dans les réglages du navigateur à chaque incident, tu cliques sur une seule icône.

## Ce que l’extension peut résoudre

Elle peut aider lorsqu’un accès défectueux à l’Intra ou au profil est causé par des données enregistrées localement dans le navigateur. Elle remet les deux sites dans un état local nettoyé et recharge leurs pages pour repartir avec de nouvelles données.

Elle ne répare pas une panne des serveurs de 42, un problème de réseau ou de DNS, un accès refusé par 42, ni un problème propre au compte. Si le nettoyage réussit mais que le profil reste inaccessible, la cause peut être ailleurs. Elle ne garantit pas non plus que le problème ne reviendra jamais.

## Compatibilité

L’extension utilise Manifest V3 et les API standard de Chrome. Le code exécuté dans le navigateur ne dépend d’aucun programme propre à Linux, Windows ou macOS.

| Navigateur | Linux | Windows | macOS |
| --- | --- | --- | --- |
| Brave sur ordinateur | Testé dans un profil temporaire | Compatibilité prévue, non testée directement | Compatibilité prévue, non testée directement |
| Google Chrome sur ordinateur | Compatibilité prévue, non testée directement | Compatibilité prévue, non testée directement | Compatibilité prévue, non testée directement |

Prérequis :

- Google Chrome **132 ou ultérieur**, ou une version de Brave basée sur **Chromium 132 ou ultérieur**.
- Un système pris en charge par la version du navigateur utilisée.
- La possibilité de charger une extension locale en mode développeur. Un navigateur géré par une école ou une entreprise peut bloquer cette installation.

La même archive s’utilise sur les trois systèmes, sans compilation. **Node.js et Python ne sont pas nécessaires pour installer ou utiliser l’extension.** Ce paquet ne vise pas Safari, Firefox ou les navigateurs mobiles.

Google décrit le [chargement d’extensions locales sur Windows, Mac et Linux](https://support.google.com/chrome/a/answer/2714278?hl=fr), et Brave utilise le [système d’extensions de Chrome](https://brave.com/learn/using-chrome-extensions-in-brave/). La compatibilité prévue ci-dessus est déduite de ces mécanismes et du code ; elle ne remplace pas un test sur chaque plateforme.

## Installation

### 1. Préparer le dossier

Si tu as reçu `42-reset-brave.zip`, décompresse l’archive. Le nom du ZIP mentionne Brave, mais son contenu est également prévu pour Chrome.

Place le dossier extrait `42-reset` dans un emplacement durable de ton ordinateur. Si tu utilises directement les sources du projet, sélectionne le dossier du projet à la place.

Le dossier à charger doit contenir directement `manifest.json`, `background.js`, `cleaner.js`, `toolbar.js` et le dossier `icons`. Sélectionne **ce dossier**, pas le fichier ZIP, ni son dossier parent. Ne déplace pas et ne supprime pas ce dossier après l’installation : le navigateur utilise ses fichiers.

### 2. Charger l’extension

1. Ouvre le navigateur et le profil dans lequel tu utilises l’Intra.
2. Saisis l’adresse correspondant à ton navigateur dans la barre d’adresse :

   | Navigateur | Adresse |
   | --- | --- |
   | Brave | `brave://extensions` |
   | Google Chrome | `chrome://extensions` |

3. Active **Mode développeur**, généralement en haut à droite.
4. Clique sur **Charger l’extension non empaquetée**. Selon la langue ou la version, le bouton peut s’appeler **Charger l’extension décompressée** ou **Load unpacked**.
5. Choisis le dossier qui contient `manifest.json` et valide.
6. Vérifie que **42 Reset — Débloquer l’Intra** apparaît dans la liste et que l’extension est activée.

Ces étapes sont identiques sous Linux, Windows et macOS ; seul le sélecteur de dossier change. Il s’agit d’une installation locale : l’extension n’est pas publiée sur le Chrome Web Store.

### 3. Épingler l’icône

Ouvre le menu des extensions, généralement représenté par une pièce de puzzle à côté de la barre d’adresse, puis épingle **42 Reset**. Le carré noir avec le **42 blanc** devient accessible dans la barre d’outils.

**L’installation et le rechargement de l’extension ne lancent aucun nettoyage. Il faut cliquer sur son icône.**

## Utilisation quotidienne

1. Enregistre toute saisie en cours sur les pages Intra : elles vont être rechargées.
2. Quand ton profil ne s’ouvre plus ou que tu souhaites réinitialiser les données locales, clique **une seule fois** sur l’icône 42.
3. Un cercle blanc tourne sur le carré noir pendant le nettoyage. Aucune popup, nouvelle fenêtre ou nouvel onglet n’est créé par le nettoyage.
4. Les onglets déjà ouverts sur les deux sites passent brièvement par une page d’attente dans leur propre onglet, puis retrouvent leur adresse d’origine.
5. Quand le 42 blanc revient, survole l’icône pour lire le résultat. Reconnecte-toi à 42 si le site le demande.

Le nettoyage peut prendre plusieurs secondes. Des clics supplémentaires pendant une opération en cours ne lancent pas d’opérations concurrentes.

Tu peux aussi cliquer depuis un autre site ou lorsqu’aucun onglet Intra n’est ouvert. Le nettoyage est tout de même effectué ; il faudra ensuite ouvrir toi-même [l’Intra](https://intra.42.fr/) ou [ton profil](https://profile.intra.42.fr/). L’extension n’ouvre pas automatiquement le profil dans un nouvel onglet.

### Lire les indicateurs

| Affichage | Signification | Action |
| --- | --- | --- |
| Carré noir avec 42 blanc | Extension au repos, ou opération terminée | Survoler l’icône pour lire son état |
| Cercle blanc qui tourne | Nettoyage en cours | Attendre la fin |
| Petit badge `!`, blanc sur fond noir | Nettoyage incomplet ou interrompu | Lire le détail au survol, puis cliquer pour réessayer |

Les textes de l’extension et de la page d’attente sont actuellement en français. Les trois langues concernent cette documentation.

## Données nettoyées et périmètre

Les origines visées sont `https://intra.42.fr`, `https://profile.intra.42.fr` et leurs équivalents HTTP sur les ports standards. Le stockage des autres sous-domaines n’est pas inclus automatiquement.

| Données | Traitement |
| --- | --- |
| Cookies utilisables par les deux hôtes | Suppression ciblée, y compris les cookies HttpOnly, partitionnés et associés à différents chemins |
| Cookies partagés `.intra.42.fr` et `.42.fr` | Suppression lorsqu’ils s’appliquent à l’un des deux hôtes |
| Cache HTTP et Cache Storage | Suppression pour les origines ciblées |
| localStorage et IndexedDB | Suppression pour les origines ciblées |
| Systèmes de fichiers du site et service workers | Suppression pour les origines ciblées ; WebSQL est aussi demandé si le navigateur le prend encore en charge |
| sessionStorage | Effacement dans les documents accessibles des onglets Intra ouverts au moment du clic |

**Les cookies partagés avec `.42.fr` peuvent servir à plusieurs services : leur suppression peut donc te déconnecter d’autres services 42.** Les cookies propres à un autre hôte, comme `other.42.fr`, sont conservés. Les cookies sont supprimés individuellement pour éviter un effacement général des cookies de tout le domaine.

Le stockage de session des onglets déjà fermés ou archivés par le navigateur et des iframes Intra intégrées dans d’autres sites n’est pas garanti. Une page ou un document inaccessible peut entraîner un résultat partiel.

Le nettoyage s’applique uniquement au **profil du navigateur où l’extension est installée**, hors navigation privée. Il ne nettoie ni les autres profils, ni un autre navigateur, ni les autres appareils.

## Effets à connaître

- Les pages Intra sont rechargées : les saisies non enregistrées peuvent être perdues.
- Une reconnexion peut être nécessaire. Certaines préférences ou données hors ligne propres au site peuvent être supprimées.
- Les mots de passe du gestionnaire du navigateur, l’historique, les favoris, les fichiers téléchargés et les autorisations des sites sont conservés.
- L’extension ne supprime pas ton compte, tes projets ou ta progression sur les serveurs de 42.
- Les sites pourront recréer des cookies et du cache normalement après le nettoyage. Leur réapparition ne signifie pas que l’opération a échoué.
- La suppression des données locales n’a pas de fonction d’annulation dans l’extension.

## Dépannage

| Situation | Que faire |
| --- | --- |
| Le bouton de chargement n’apparaît pas | Vérifier le mode développeur. Si le navigateur est géré, demander à l’administrateur si les extensions locales sont autorisées. |
| Le navigateur ne trouve pas le manifeste | Décompresser le ZIP et sélectionner le dossier qui contient directement `manifest.json`. |
| L’icône n’apparaît pas dans la barre | Vérifier que l’extension est activée, puis l’épingler dans le menu des extensions. |
| Un badge `!` apparaît | Survoler l’icône pour lire le détail, fermer les autres pages 42 si des cookies sont recréés, puis réessayer. |
| Le cercle ou la page d’attente reste affiché | Attendre quelques instants. Si l’opération semble bloquée, recharger l’extension depuis la page des extensions, réessayer puis rouvrir manuellement le profil si nécessaire. |
| Le site demande une connexion | C’est un effet attendu de la suppression des cookies de session. Se reconnecter normalement. |
| Le nettoyage réussit mais le profil reste inaccessible | Vérifier l’accès au site et le réseau ; un incident de service ou de compte peut nécessiter l’aide du support 42. |
| Le problème revient plus tard | Relancer le nettoyage. L’extension automatise une réinitialisation locale, sans corriger définitivement la cause du dysfonctionnement. |

## Mise à jour et désinstallation

Pour mettre à jour :

1. Remplace les fichiers du dossier installé par ceux de la nouvelle version, en conservant le même emplacement.
2. Ouvre `brave://extensions` ou `chrome://extensions`.
3. Clique sur **Recharger** sur la carte de 42 Reset. Le rechargement seul n’efface aucune donnée des sites.

Pour désactiver temporairement l’extension, utilise son interrupteur sur cette même page. Pour la désinstaller, clique sur **Supprimer**, puis confirme dans le navigateur. Tu peux ensuite supprimer son dossier si tu n’en as plus besoin. La désinstallation ne restaure pas les données déjà effacées.

## Confidentialité et permissions

Pas de compte à créer, de télémétrie, de serveur de collecte ni de bibliothèque distante. Le code ne journalise et ne conserve aucune valeur de cookie. La progression et le résultat du dernier nettoyage sont conservés en mémoire dans `chrome.storage.session`, jusqu’à la fin de la session du navigateur.

Le rechargement des pages entraîne leurs requêtes habituelles vers 42, comme lors d’une navigation normale.

| Permission | Utilité dans cette extension |
| --- | --- |
| `cookies` | Rechercher et supprimer les cookies ciblés |
| `browsingData` | Effacer le cache et le stockage avec une liste fixe d’origines ; cette permission est techniquement large, mais le code n’effectue pas de nettoyage global |
| `scripting` | Vider le stockage de session des pages Intra accessibles |
| `storage` | Conserver la progression et le résultat en mémoire |
| Accès à `intra.42.fr` et `profile.intra.42.fr` | Intervenir sur les deux hôtes uniquement, sans demander l’accès à tous les sites |

## Pour les développeurs

Le dossier source complet contient les scripts et les tests ; l’archive d’installation contient seulement l’extension et sa documentation.

Avec Node.js, npm et Python 3 disponibles, depuis les sources :

```sh
npm test
npm run pack
```

La première commande exécute les tests de logique. La seconde produit `dist/42-reset-brave.zip`, utilisable dans Brave ou Chrome après extraction. Aucun `npm install` n’est nécessaire pour ces commandes.

Le test d’intégration facultatif `scripts/test-browser.mjs` nécessite Playwright et un navigateur installé. Il utilise un profil temporaire et des réponses de sites simulées ; il ne modifie pas le profil personnel. Les variables `PLAYWRIGHT_MODULE` et `BROWSER_EXECUTABLE` permettent d’indiquer leurs chemins. Le fonctionnement a été vérifié dans Brave sous Linux : nettoyage des stockages et cookies, conservation des données étrangères, rechargement des onglets et animation sans popup ni nouvel onglet. Cela ne constitue pas un diagnostic du site réel.

Le script facultatif `scripts/generate-icons.py` requiert Pillow ; son chemin de police par défaut correspond à Linux et doit être adapté sur un autre système pour régénérer les icônes. Les PNG déjà fournis fonctionnent sans ce script.

## Références

- [Installer une extension locale dans Chrome](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world)
- [Version minimale de Chrome dans le manifeste](https://developer.chrome.com/docs/extensions/reference/manifest/minimum-chrome-version)
- [API browsingData](https://developer.chrome.com/docs/extensions/reference/api/browsingData)
- [API cookies](https://developer.chrome.com/docs/extensions/reference/api/cookies)
- [API action : icône et bouton de la barre d’outils](https://developer.chrome.com/docs/extensions/reference/api/action)
