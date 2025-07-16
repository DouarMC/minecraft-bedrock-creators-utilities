import fs from "fs";
import path from "path";
import * as vscode from "vscode";
import { getAllBlockIdentifiers, getAllLootTablePaths } from "../getContent";

const schemaEnums = {
    menu_categories: ["construction", "nature", "equipment", "items", "none"],
    block_ids: getAllBlockIdentifiers(),
    loot_table_paths: getAllLootTablePaths(),
    block_model_ids: ["minecraft:geometry.full_block", "minecraft:geometry.cross"],
    crafting_recipe_tags: ["crafting_table", "stonecutter"],
    tint_methods: ["none", "default_foliage", "birch_foliage", "evergreen_foliage", "dry_foliage", "grass", "water"],
    vanilla_culling_layers: ["minecraft:culling_layer.undefined", "minecraft:culling_layer.leaves"],
    entity_damage_causes: ["all", "anvil", "block_explosion", "campfire", "charging", "contact", "drowning", "entity_attack", "entity_explosion", "fall", "falling_block", "fire", "fire_tick", "fireworks", "fly_into_wall", "freezing", "lava", "lightning", "mace_smash", "magic", "magma", "none", "override", "piston", "projectile", "ram_attack", "self_destruct", "sonic_boom", "soul_campfire", "stalactite", "stalagmite", "starve", "suffocation", "temperature", "thorns", "void", "wither"]
};

export const schemaRef = {
    menu_categories: "../../../../.vscode/generated_schemas/menu_categories.schema.json",
    block_ids: "../../../../.vscode/generated_schemas/block_ids.schema.json",
    loot_table_paths: "../../../../.vscode/generated_schemas/loot_table_paths.schema.json",
    block_model_ids: "../../../../.vscode/generated_schemas/block_model_ids.schema.json",
    crafting_recipe_tags: "../../../../.vscode/generated_schemas/crafting_recipe_tags.schema.json",
    tint_methods: "../../../../.vscode/generated_schemas/tint_methods.schema.json",
    vanilla_culling_layers: "../../../../.vscode/generated_schemas/vanilla_culling_layers.schema.json",
    entity_damage_causes: "../../../../.vscode/generated_schemas/entity_damage_causes.schema.json"
};

export function generateSchemaEnumsFiles() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        console.error("Aucun workspace ouvert, génération des schémas annulée.");
        return;
    }

    const workspaceRoot = workspaceFolders[0].uri.fsPath;
    const outputDir = path.join(workspaceRoot, '.vscode', 'generated_schemas');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const [key, values] of Object.entries(schemaEnums)) {
        const schema = {
            $schema: "https://json-schema.org/draft-07/schema#",
            examples: values
        };
        fs.writeFileSync(
            path.join(outputDir, `${key}.schema.json`),
            JSON.stringify(schema, null, 2),
            "utf-8"
        );
    }
    console.log("Schémas générés dans", outputDir);
}