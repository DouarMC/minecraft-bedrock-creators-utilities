# Minecraft Bedrock Creator Utilities

Extension VS Code qui regroupe des outils pour créer et modifier des add-ons Minecraft Bedrock.

## Fonctionnalités

- Création de projets Add-on avec Behavior Pack et/ou Resource Pack, manifests, icônes et fichiers de langue.
- Ajout de l’API Script, avec TypeScript local aux nouveaux projets Script API.
- Préparation, export en `.mcpack` / `.mcaddon`, déploiement manuel et déploiement automatique des packs.
- Assistance pour les fichiers JSON/JSONC Minecraft : diagnostics, survol et suggestions.
- Outils complémentaires : ouverture des dossiers Minecraft, éditeur Molang, visualisation de fichiers `.mcstats` et extraction de `.brarchive`.

La création de projets est actuellement limitée aux Add-ons. Les types `skin_pack` et `world_template` ne sont pas encore pris en charge dans ce parcours.

## Prérequis

- VS Code 1.100 ou ultérieur.
- Windows et une installation de Minecraft Bedrock pour détecter les dossiers du jeu et déployer les packs.
- Node.js et npm pour installer les dépendances des projets Script API.

## Développement

```sh
npm ci
npm test
npm run test:vscode
```

`npm test` compile le projet, lance ESLint et exécute les tests unitaires. `npm run test:vscode` lance aussi les tests d’intégration dans un Extension Host VS Code; le runner télécharge une version de VS Code si `VSCODE_EXECUTABLE_PATH` n’est pas défini.

`npm run build-schemas` génère les ressources de schémas utilisées par le workflow de publication des ressources sur GitHub Pages.
