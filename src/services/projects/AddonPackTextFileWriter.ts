import { MinecraftAddonPackType } from '../../core/minecraft/models/MinecraftTypes';
import { ProjectMetadata } from '../../types/projectConfig';

export interface AddonPackTextFileWriterDependencies<TUri> {
    joinPath(base: TUri, ...pathSegments: string[]): TUri;
    createDirectory(uri: TUri): Promise<void>;
    isDirectoryAlreadyExists(error: unknown): boolean;
    writeFile(uri: TUri, content: string): Promise<void>;
}

export class AddonPackTextFileWriter {
    public static async create<TUri>(
        packFolder: TUri,
        projectMetadata: ProjectMetadata,
        packType: MinecraftAddonPackType,
        dependencies: AddonPackTextFileWriterDependencies<TUri>
    ): Promise<void> {
        const textsFolder = dependencies.joinPath(packFolder, 'texts');
        try {
            await dependencies.createDirectory(textsFolder);
        } catch (error) {
            if (!dependencies.isDirectoryAlreadyExists(error)) {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la création du dossier "texts" : ${error.message}`);
                }

                throw error;
            }
        }

        const languagesPath = dependencies.joinPath(textsFolder, 'languages.json');
        try {
            await dependencies.writeFile(languagesPath, JSON.stringify(['en_US'], null, 4));
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la création du fichier languages.json : ${error.message}`);
            }

            throw error;
        }

        const displayName = projectMetadata.displayName;
        const author = projectMetadata.author;
        const packLabel = packType === 'behavior_pack' ? 'BP' : 'RP';
        const langContent =
            `pack.name=${displayName} ${packLabel} [v0.0.1] - by ${author}` +
            `\npack.description=Pack for ${displayName} - Created by ${author}`;
        const enUSPath = dependencies.joinPath(textsFolder, 'en_US.lang');
        try {
            await dependencies.writeFile(enUSPath, langContent);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la création du fichier en_US.lang : ${error.message}`);
            }

            throw error;
        }
    }
}
