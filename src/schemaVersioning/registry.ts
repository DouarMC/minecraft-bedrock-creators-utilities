import { baseSchema as aimAssistCategoriesBaseSchema } from "./versionedChanges/behavior_pack/aim_assist/categories/categories";
import { baseSchema as _aimAssistPresetBaseSchema } from "./versionedChanges/behavior_pack/aim_assist/presets/_aim_assist_preset";
import { baseSchema as _animationControllersBaseSchemaBP } from "./versionedChanges/behavior_pack/animation_controllers/_animation_controllers";
import { baseSchema as _animationsBaseSchemaBP } from "./versionedChanges/behavior_pack/animations/_animations";
import { baseSchema as _biomeBaseSchema } from "./versionedChanges/behavior_pack/biomes/_biome";

// Import des schémas de base et des modifications versionnées pour les blocs
import {
  versionedChanges as _blockChanges,
  baseSchema as _blockBaseSchema
} from "./versionedChanges/behavior_pack/blocks/_block";

// Import des schémas de base et des modifications versionnées pour les items
import {
  versionedChanges as _itemChanges,
  baseSchema as _itemBaseSchema
} from "./versionedChanges/behavior_pack/items/_item";

// Décrit une modification unique à appliquer à un schéma
export interface SchemaModification {
  target: string;         // Chemin pointant vers la propriété à modifier, ex.: "minecraft:block.components.minecraft:block_light_absorption"
  action: "add" | "remove" | "modify";  // Type d'opération
  value?: any;            // Valeur à insérer ou à remplacer (pour add/modify)
  notes?: string;         // Notes optionnelles pour documentation interne
}

// Regroupe un ensemble de modifications associées à une version de Minecraft
export interface SchemaChange {
  version: string;                // Version cible, ex.: "1.21.60"
  changes: SchemaModification[];  // Liste des modifications à appliquer dès que la version du document ≥ cette version
}

// Définit un « type » de schéma, c’est-à-dire sa forme de base et son historique de changements
export interface SchemaType {
  fileMatch: string[];    // Globs pour matcher les fichiers à valider contre ce schéma
  baseSchema: any;        // Schéma JSON de départ (plain JS object)
  versionedChanges: SchemaChange[];  // Historique des changements versionnés à injecter
}

/**
 * Tableau listant tous les schémas versionnés gérés par l’extension.
 * Pour chaque type (blocs, items), on fournit :
 *  - un ID stable
 *  - la ou les patterns de fichiers à matcher
 *  - le schéma de base
 *  - les changements à appliquer selon la version du document
 */
export const schemaTypes: SchemaType[] = [
  {
    fileMatch: ["**/addon/behavior_pack/aim_assist/categories/categories.json"],
    baseSchema: aimAssistCategoriesBaseSchema,
    versionedChanges: [] // Pas de changements pour ce schéma pour l'instant
  },
  {
    fileMatch: ["**/addon/behavior_pack/aim_assist/presets/**/*.json"],
    baseSchema: _aimAssistPresetBaseSchema,
    versionedChanges: [] // Pas de changements pour ce schéma pour l'instant
  },
  {
    fileMatch: ["**/addon/behavior_pack/animation_controllers/**/*.json"],
    baseSchema: _animationControllersBaseSchemaBP,
    versionedChanges: []
  },
  {
    fileMatch: ["**/addon/behavior_pack/animations/**/*.json"],
    baseSchema: _animationsBaseSchemaBP,
    versionedChanges: []
  },
  {
    fileMatch: ["**/addon/behavior_pack/biomes/**/*.json"],
    baseSchema: _biomeBaseSchema,
    versionedChanges: []
  },
  {
    fileMatch: ["**/addon/behavior_pack/blocks/**/*.json"],
    baseSchema: _blockBaseSchema,
    versionedChanges: _blockChanges
  },
  {
    fileMatch: ["**/addon/behavior_pack/items/**/*.json"],
    baseSchema: _itemBaseSchema,
    versionedChanges: _itemChanges
  }
];