import { AddonManifestFactory } from './AddonManifestFactory';
import { AddonPackTextFileWriter } from './AddonPackTextFileWriter';
import { AddonStructureOptions } from '../../types/addonProjectSetup';
import { MinecraftAddonPackType } from '../../core/minecraft/models/MinecraftTypes';
import { ProjectMetadata } from '../../types/projectConfig';

export interface AddonProjectScaffoldDependencies<TUri> {
    joinPath(base: TUri, ...pathSegments: string[]): TUri;
    createDirectory(uri: TUri): Promise<void>;
    isFileExistsError(error: unknown): boolean;
    copyDefaultPackIcon(packFolder: TUri): Promise<void>;
    writeFile(uri: TUri, content: string): Promise<void>;
    createScriptApiStructure(projectFolder: TUri): Promise<void>;
    installNpmDependencies(projectFolder: TUri): Promise<void>;
}

export class AddonProjectScaffoldWriter {
    private static async createAddonFolder<TUri>(
        projectFolder: TUri,
        dependencies: AddonProjectScaffoldDependencies<TUri>
    ): Promise<TUri> {
        const addonFolder = dependencies.joinPath(projectFolder, 'addon');
        try {
            await dependencies.createDirectory(addonFolder);
        } catch (error) {
            if (!dependencies.isFileExistsError(error)) {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la création du dossier "addon" : ${error.message}`);
                }

                throw error;
            }
        }

        return addonFolder;
    }

    private static async createBehaviorPackFolder<TUri>(
        projectFolder: TUri,
        dependencies: AddonProjectScaffoldDependencies<TUri>
    ): Promise<TUri> {
        const behaviorPackFolder = dependencies.joinPath(projectFolder, 'addon', 'behavior_pack');
        try {
            await dependencies.createDirectory(behaviorPackFolder);
        } catch (error) {
            if (!dependencies.isFileExistsError(error)) {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la création du dossier du pack de comportement : ${error.message}`);
                }

                throw error;
            }
        }

        return behaviorPackFolder;
    }

    private static async createResourcePackFolder<TUri>(
        projectFolder: TUri,
        dependencies: AddonProjectScaffoldDependencies<TUri>
    ): Promise<TUri> {
        const resourcePackFolder = dependencies.joinPath(projectFolder, 'addon', 'resource_pack');
        try {
            await dependencies.createDirectory(resourcePackFolder);
        } catch (error) {
            if (!dependencies.isFileExistsError(error)) {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la création du dossier du pack de ressources : ${error.message}`);
                }

                throw error;
            }
        }

        return resourcePackFolder;
    }

    private static async createPackIconFile<TUri>(
        packFolder: TUri,
        dependencies: AddonProjectScaffoldDependencies<TUri>
    ): Promise<void> {
        try {
            await dependencies.copyDefaultPackIcon(packFolder);
        } catch (error) {
            if (!dependencies.isFileExistsError(error)) {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la création du fichier pack_icon.png : ${error.message}`);
                }

                throw error;
            }
        }
    }

    private static async createEnUsLangFile<TUri>(
        packFolder: TUri,
        metadata: ProjectMetadata,
        packType: MinecraftAddonPackType,
        dependencies: AddonProjectScaffoldDependencies<TUri>
    ): Promise<void> {
        await AddonPackTextFileWriter.create(packFolder, metadata, packType, {
            joinPath: dependencies.joinPath,
            createDirectory: dependencies.createDirectory,
            isDirectoryAlreadyExists: dependencies.isFileExistsError,
            writeFile: dependencies.writeFile
        });
    }

    public static async create<TUri>(
        projectFolder: TUri,
        metadata: ProjectMetadata,
        options: AddonStructureOptions,
        dependencies: AddonProjectScaffoldDependencies<TUri>
    ): Promise<void> {
        if (options.packTypes.length === 0) {
            throw new Error('Aucun type de pack sélectionné pour l\'addon.');
        }
        if (options.packTypes.includes('behavior_pack') && options.behaviorPackModuleTypes.length === 0) {
            throw new Error('Aucun type de module sélectionné pour le pack de comportement.');
        }

        const includesScriptApi = options.packTypes.includes('behavior_pack')
            && options.behaviorPackModuleTypes.includes('script');
        const packageJsonContent = AddonManifestFactory.createPackageJson(metadata, includesScriptApi);

        let addonFolder: TUri;
        try {
            addonFolder = await this.createAddonFolder(projectFolder, dependencies);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la création du dossier "addon" : ${error.message}`);
            }

            throw error;
        }

        const isBehaviorPack = options.packTypes.includes('behavior_pack');
        const isResourcePack = options.packTypes.includes('resource_pack');
        let behaviorManifest: any = undefined;
        let resourceManifest: any = undefined;

        if (isBehaviorPack) {
            let behaviorPackFolder: TUri;
            try {
                behaviorPackFolder = await this.createBehaviorPackFolder(projectFolder, dependencies);
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la création du dossier du pack de comportement : ${error.message}`);
                }

                throw error;
            }

            behaviorManifest = AddonManifestFactory.createBehaviorPackManifest(options.behaviorPackModuleTypes);

            if (options.behaviorPackModuleTypes.includes('script')) {
                try {
                    await dependencies.createScriptApiStructure(projectFolder);
                } catch (error) {
                    if (error instanceof Error) {
                        throw new Error(`Erreur lors de la création de la structure de l'API Script : ${error.message}`);
                    }

                    throw error;
                }

                if (options.scriptApiModules !== undefined) {
                    AddonManifestFactory.addScriptApiModules(behaviorManifest, packageJsonContent, options.scriptApiModules);
                }
            }

            try {
                await this.createPackIconFile(behaviorPackFolder, dependencies);
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la création du fichier pack_icon.png du pack de comportement : ${error.message}`);
                }

                throw error;
            }

            try {
                await this.createEnUsLangFile(behaviorPackFolder, metadata, 'behavior_pack', dependencies);
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la création du fichier en_US.lang du pack de comportement : ${error.message}`);
                }

                throw error;
            }
        }

        if (isResourcePack) {
            let resourcePackFolder: TUri;
            try {
                resourcePackFolder = await this.createResourcePackFolder(projectFolder, dependencies);
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la création du dossier du pack de ressources : ${error.message}`);
                }

                throw error;
            }

            resourceManifest = AddonManifestFactory.createResourcePackManifest();

            try {
                await this.createPackIconFile(resourcePackFolder, dependencies);
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la création du fichier pack_icon.png du pack de ressources : ${error.message}`);
                }

                throw error;
            }

            try {
                await this.createEnUsLangFile(resourcePackFolder, metadata, 'resource_pack', dependencies);
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de la création du fichier en_US.lang du pack de ressources : ${error.message}`);
                }

                throw error;
            }
        }

        AddonManifestFactory.configurePackDependencies(behaviorManifest, resourceManifest);

        if (behaviorManifest !== undefined) {
            const behaviorManifestPath = dependencies.joinPath(addonFolder, 'behavior_pack', 'manifest.json');
            try {
                await dependencies.writeFile(behaviorManifestPath, JSON.stringify(behaviorManifest, null, 4));
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de l'écriture du manifeste du pack de comportement : ${error.message}`);
                }

                throw error;
            }
        }

        if (resourceManifest !== undefined) {
            const resourceManifestPath = dependencies.joinPath(addonFolder, 'resource_pack', 'manifest.json');
            try {
                await dependencies.writeFile(resourceManifestPath, JSON.stringify(resourceManifest, null, 4));
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(`Erreur lors de l'écriture du manifeste du pack de ressources : ${error.message}`);
                }

                throw error;
            }
        }

        try {
            await dependencies.writeFile(
                dependencies.joinPath(projectFolder, 'package.json'),
                JSON.stringify(packageJsonContent, null, 4)
            );
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de la création du fichier package.json : ${error.message}`);
            }

            throw error;
        }

        try {
            await dependencies.installNpmDependencies(projectFolder);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Erreur lors de l'installation des dépendances npm : ${error.message}`);
            }

            throw error;
        }
    }
}
