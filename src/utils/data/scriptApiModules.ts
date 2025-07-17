/**
 * la dernière version stable de Minecraft, utile pour l'installation des modules de l'API Script beta.
 */
export const LAST_STABLE_VERSION = "1.21.84-stable";

/**
 * la dernière version preview de Minecraft, utile pour l'installation des modules de l'API Script beta et release candidate preview.
 */
export const LAST_PREVIEW_VERSION = "1.21.100-preview.20";

/**
 * Contient les modules de l'API Script et leurs versions en version stable.
 */
export const SCRIPT_API_MODULES_VERSIONS_PACKAGE: Record<string, Record<string, string>> = {
    "@minecraft/server": {
        "1.0.0": "1.0.0",
        "1.1.0": "1.1.0",
        "1.2.0": "1.2.0",
        "1.3.0": "1.3.0",
        "1.4.0": "1.4.0",
        "1.5.0": "1.5.0",
        "1.6.0": "1.6.0",
        "1.7.0": "1.7.0",
        "1.8.0": "1.8.0",
        "1.9.0": "1.9.0",
        "1.10.0": "1.10.0",
        "1.11.0": "1.11.0",
        "1.12.0": "1.12.0",
        "1.13.0": "1.13.0",
        "1.14.0": "1.14.0",
        "1.15.0": "1.15.0",
        "1.16.0": "1.16.0",
        "1.17.0": "1.17.0",
        "1.18.0": "1.18.0",
        "1.19.0": "1.19.0",
        "2.0.0-beta": `2.0.0-beta.${LAST_STABLE_VERSION}`
    },
    "@minecraft/server-ui": {
        "1.0.0": "1.0.0",
        "1.1.0": "1.1.0",
        "1.2.0": "1.2.0",
        "1.3.0": "1.3.0",
        "2.0.0-beta": `2.0.0-beta.${LAST_STABLE_VERSION}`
    },
    "@minecraft/server-admin": {
        "1.0.0-beta": `1.0.0-beta.${LAST_STABLE_VERSION}`
    },
    "@minecraft/server-net": {
        "1.0.0-beta": `1.0.0-beta.${LAST_STABLE_VERSION}`
    },
    "@minecraft/server-gametest": {
        "1.0.0-beta": `1.0.0-beta.${LAST_STABLE_VERSION}`
    },
    "@minecraft/server-editor": {
        "0.1.0-beta": `0.1.0-beta.${LAST_STABLE_VERSION}`
    },
    "@minecraft/diagnostics": {
        "1.0.0-beta": `1.0.0-beta.${LAST_STABLE_VERSION}`
    },
    "@minecraft/debug-utilities": {
        "1.0.0-beta": `1.0.0-beta.${LAST_STABLE_VERSION}`
    }
};

/**
 * Contient les modules de l'API Script et leurs versions.
 */
export const SCRIPT_API_MODULES: Record<string, string[]> = {
    "@minecraft/server": Object.keys(SCRIPT_API_MODULES_VERSIONS_PACKAGE["@minecraft/server"]),
    "@minecraft/server-ui": Object.keys(SCRIPT_API_MODULES_VERSIONS_PACKAGE["@minecraft/server-ui"]),
    "@minecraft/server-admin": Object.keys(SCRIPT_API_MODULES_VERSIONS_PACKAGE["@minecraft/server-admin"]),
    "@minecraft/server-net": Object.keys(SCRIPT_API_MODULES_VERSIONS_PACKAGE["@minecraft/server-net"]),
    "@minecraft/server-gametest": Object.keys(SCRIPT_API_MODULES_VERSIONS_PACKAGE["@minecraft/server-gametest"]),
    "@minecraft/server-editor": Object.keys(SCRIPT_API_MODULES_VERSIONS_PACKAGE["@minecraft/server-editor"]),
    "@minecraft/diagnostics": Object.keys(SCRIPT_API_MODULES_VERSIONS_PACKAGE["@minecraft/diagnostics"]),
    "@minecraft/debug-utilities": Object.keys(SCRIPT_API_MODULES_VERSIONS_PACKAGE["@minecraft/debug-utilities"])
};

/**
 * Liste des noms des modules de l'API Script et leurs versions.
 */
export const SCRIPT_API_MODULES_NAMES: string[] = Object.keys(SCRIPT_API_MODULES);

/**
 * Contient les modules de l'API Script et leurs versions en version preview.
 */
export const SCRIPT_API_MODULES_VERSIONS_PACKAGE_PREVIEW: Record<string, Record<string, string>> = {
    "@minecraft/server": {
        "1.0.0": "1.0.0",
        "1.1.0": "1.1.0",
        "1.2.0": "1.2.0",
        "1.3.0": "1.3.0",
        "1.4.0": "1.4.0",
        "1.5.0": "1.5.0",
        "1.6.0": "1.6.0",
        "1.7.0": "1.7.0",
        "1.8.0": "1.8.0",
        "1.9.0": "1.9.0",
        "1.10.0": "1.10.0",
        "1.11.0": "1.11.0",
        "1.12.0": "1.12.0",
        "1.13.0": "1.13.0",
        "1.14.0": "1.14.0",
        "1.15.0": "1.15.0",
        "1.16.0": "1.16.0",
        "1.17.0": "1.17.0",
        "1.18.0": "1.18.0",
        "1.19.0": "1.19.0",
        "2.0.0": `2.0.0-rc.${LAST_PREVIEW_VERSION}`,
        "2.1.0": `2.1.0-rc.${LAST_PREVIEW_VERSION}`,
        "2.2.0-beta": `2.2.0-beta.${LAST_PREVIEW_VERSION}`
    },
    "@minecraft/server-ui": {
        "1.0.0": "1.0.0",
        "1.1.0": "1.1.0",
        "1.2.0": "1.2.0",
        "1.3.0": "1.3.0",
        "2.0.0": `2.0.0-rc.${LAST_PREVIEW_VERSION}`,
        "2.1.0-beta": `2.1.0-beta.${LAST_PREVIEW_VERSION}`
    },
    "@minecraft/server-admin": {
        "1.0.0-beta": `1.0.0-beta.${LAST_PREVIEW_VERSION}`
    },
    "@minecraft/server-net": {
        "1.0.0-beta": `1.0.0-beta.${LAST_PREVIEW_VERSION}`
    },
    "@minecraft/server-gametest": {
        "1.0.0-beta": `1.0.0-beta.${LAST_PREVIEW_VERSION}`
    },
    "@minecraft/server-editor": {
        "0.1.0-beta": `0.1.0-beta.${LAST_PREVIEW_VERSION}`
    },
    "@minecraft/diagnostics": {
        "1.0.0-beta": `1.0.0-beta.${LAST_PREVIEW_VERSION}`
    },
    "@minecraft/debug-utilities": {
        "1.0.0-beta": `1.0.0-beta.${LAST_PREVIEW_VERSION}`
    }
};

/**
 * Contient les modules de l'API Script et leurs versions en version preview.
 */
export const SCRIPT_API_MODULES_PREVIEW: Record<string, string[]> = {
    "@minecraft/server": Object.keys(SCRIPT_API_MODULES_VERSIONS_PACKAGE_PREVIEW["@minecraft/server"]),
    "@minecraft/server-ui": Object.keys(SCRIPT_API_MODULES_VERSIONS_PACKAGE_PREVIEW["@minecraft/server-ui"]),
    "@minecraft/server-admin": Object.keys(SCRIPT_API_MODULES_VERSIONS_PACKAGE_PREVIEW["@minecraft/server-admin"]),
    "@minecraft/server-net": Object.keys(SCRIPT_API_MODULES_VERSIONS_PACKAGE_PREVIEW["@minecraft/server-net"]),
    "@minecraft/server-gametest": Object.keys(SCRIPT_API_MODULES_VERSIONS_PACKAGE_PREVIEW["@minecraft/server-gametest"]),
    "@minecraft/server-editor": Object.keys(SCRIPT_API_MODULES_VERSIONS_PACKAGE_PREVIEW["@minecraft/server-editor"]),
    "@minecraft/diagnostics": Object.keys(SCRIPT_API_MODULES_VERSIONS_PACKAGE_PREVIEW["@minecraft/diagnostics"]),
    "@minecraft/debug-utilities": Object.keys(SCRIPT_API_MODULES_VERSIONS_PACKAGE_PREVIEW["@minecraft/debug-utilities"])
};

/**
 * Liste des noms des modules de l'API Script en version preview.
 */
export const SCRIPT_API_MODULES_NAMES_PREVIEW: string[] = Object.keys(SCRIPT_API_MODULES_PREVIEW);