import { MinecraftPackType } from "../models/MinecraftTypes";
import { MinecraftFileId } from "./MinecraftFileId";

export class MinecraftFileType {
    /**
     * Identifiant unique du type de fichier Minecraft. Exemple : "behavior_pack/blocks/<all>.json".
     */
    public readonly id: MinecraftFileId;

    /**
     * Type de pack Minecraft auquel ce type de fichier appartient. Exemple : "behavior_pack" ou "resource_pack".
     */
    public readonly packType: MinecraftPackType;

    /**
     * Nom affiché pour ce type de fichier dans l'interface utilisateur. Exemple : "Fichier de blocs".
     */
    public readonly displayName: string;

    /**
     * Liste des motifs de fichiers (patterns) qui correspondent à ce type de fichier Minecraft. Exemple : ["behavior_pack/blocks/*.json"].
     */
    public readonly patterns: string[];

    /**
     * Liste des motifs de fichiers (patterns) à exclure pour ce type de fichier Minecraft. Exemple : ["behavior_pack/blocks/exclude/*.json"].
     */
    readonly excludePatterns?: string[];

    /**
     * Indique si la recherche de ce type de fichier doit inclure le dossier "definitions" des jeux Minecraft. Par défaut, cette valeur est false.
     */
    public readonly searchInDefinitionsFolder: boolean = false;

    /**
     * Chemin relatif vers le schéma JSON associé à ce type de fichier Minecraft. Exemple : "schemas/blocks.schema.json". Si ce champ est défini, il sera utilisé pour valider les fichiers correspondants à ce type de fichier. Associé aux github pages de l'extension.
     */
    public readonly schemaPath?: string;

    public constructor(options: {
        id: MinecraftFileId;
        packType: MinecraftPackType;
        displayName: string;
        patterns: string[];
        excludePatterns?: string[];
        searchInDefinitionsFolder?: boolean;
        schemaPath?: string;
    }) {
        this.id = options.id;
        this.packType = options.packType;
        this.displayName = options.displayName;
        this.patterns = options.patterns;
        this.excludePatterns = options.excludePatterns;
        this.searchInDefinitionsFolder = options.searchInDefinitionsFolder ?? false;
        this.schemaPath = options.schemaPath;
    }
}