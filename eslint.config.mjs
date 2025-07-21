/*
Ce fichier configure ESLint, un outil qui :
- détecte les erreurs de code (syntaxe, typos, bugs potentiels),
- applique des règles de style (indentation, const vs let, noms de variables…),
- peut parfois corriger automatiquement le code avec `eslint --fix`.

VS Code détecte automatiquement ce fichier (`eslint.config.mjs`, `.eslintrc`, etc.)
et applique ces règles à tous les fichiers correspondants.
*/

import typescriptEslint from "@typescript-eslint/eslint-plugin"; // Plugin contenant des règles spécifiques à TypeScript
import tsParser from "@typescript-eslint/parser"; // Permet à ESLint de comprendre du code TypeScript

export default [
    {
        files: ["**/*.ts"], // Applique les règles aux fichiers .ts uniquement
    },
    {
        plugins: {
            "@typescript-eslint": typescriptEslint // Active les règles du plugin TypeScript
        },

        languageOptions: {
            parser: tsParser, // Analyseur pour comprendre la syntaxe TypeScript
            ecmaVersion: 2022, // Active les fonctionnalités modernes de JS (Promise.any, etc.)
            sourceType: "module" // Autorise l’utilisation des imports/exports ES modules
        },

        rules: {
            "@typescript-eslint/naming-convention": ["warn", {
                selector: "import", // Applique la règle aux noms d'import uniquement
                format: ["camelCase", "PascalCase"] // Autorise les formats camelCase et PascalCase
            }],
            curly: "off", // Autorise les blocs sans accolades (ex: `if (x) return;`)
            eqeqeq: "warn", // Avertit si on utilise == au lieu de ===
            "no-throw-literal": "warn", // Empêche `throw "message"` ; recommande `throw new Error()`
            semi: "warn" // Avertit si un point-virgule est oublié
        },
    }
];