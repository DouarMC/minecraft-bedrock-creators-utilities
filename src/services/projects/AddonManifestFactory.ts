import { randomUUID } from 'crypto';
import { AddonPackageJson } from '../../types/addonPackageJson';
import { ProjectMetadata } from '../../types/projectConfig';

export class AddonManifestFactory {
    public static createPackageJson(metadata: ProjectMetadata, includeScriptApi = false): AddonPackageJson {
        const packageJson: AddonPackageJson = {
            name: metadata.id,
            version: '0.0.1',
            description: `Package for ${metadata.displayName} project.`,
            license: 'MIT',
            dependencies: {},
            type: 'module'
        };

        if (includeScriptApi) {
            packageJson.devDependencies = { typescript: '^5.8.3' };
        }

        return packageJson;
    }

    public static createBehaviorPackManifest(moduleTypes: ('script' | 'data')[]): any {
        const behaviorManifest: any = {
            format_version: 2,
            header: {
                name: 'pack.name',
                description: 'pack.description',
                uuid: randomUUID(),
                version: [0, 0, 1],
                min_engine_version: [1, 26, 40]
            },
            modules: []
        };

        for (const type of moduleTypes) {
            if (type === 'data') {
                behaviorManifest.modules.push({
                    type: 'data',
                    uuid: randomUUID(),
                    version: [0, 0, 1]
                });
            } else if (type === 'script') {
                const hasScriptModule = behaviorManifest.modules.some((module: any) => module.type === 'script');
                if (!hasScriptModule) {
                    behaviorManifest.modules.push({
                        type: 'script',
                        uuid: randomUUID(),
                        version: [0, 0, 1],
                        language: 'javascript',
                        entry: 'scripts/main.js'
                    });
                }
            }
        }

        return behaviorManifest;
    }

    public static createResourcePackManifest(): any {
        return {
            format_version: 2,
            header: {
                name: 'pack.name',
                description: 'pack.description',
                uuid: randomUUID(),
                version: [0, 0, 1],
                min_engine_version: [1, 26, 40]
            },
            modules: [
                {
                    type: 'resources',
                    uuid: randomUUID(),
                    version: [0, 0, 1]
                }
            ]
        };
    }

    public static configurePackDependencies(behaviorManifest: any, resourceManifest: any): void {
        if (behaviorManifest && resourceManifest) {
            behaviorManifest.dependencies = behaviorManifest.dependencies ?? [];
            resourceManifest.dependencies = resourceManifest.dependencies ?? [];

            behaviorManifest.dependencies.push({
                uuid: resourceManifest.header.uuid,
                version: resourceManifest.header.version
            });

            resourceManifest.dependencies.push({
                uuid: behaviorManifest.header.uuid,
                version: behaviorManifest.header.version
            });

            resourceManifest.header.pack_scope = 'world';
        } else if (resourceManifest) {
            resourceManifest.header.pack_scope = 'any';
        }
    }

    public static addScriptApiModules(
        behaviorManifest: any,
        packageJson: any,
        modules: Record<string, { version: string, npmVersion: string }>
    ): void {
        behaviorManifest.dependencies = behaviorManifest.dependencies || [];
        for (const [moduleName, moduleInfo] of Object.entries(modules)) {
            const hasDependency = behaviorManifest.dependencies.some((dep: any) => dep.module_name === moduleName);
            if (!hasDependency) {
                behaviorManifest.dependencies.push({
                    module_name: moduleName,
                    version: moduleInfo.version
                });
            }
            if (packageJson.dependencies === undefined) {
                packageJson.dependencies = {};
            }
            if (packageJson.dependencies[moduleName] === undefined) {
                packageJson.dependencies[moduleName] = moduleInfo.npmVersion;
            } else if (packageJson.dependencies[moduleName] !== moduleInfo.npmVersion) {
                packageJson.dependencies[moduleName] = moduleInfo.npmVersion;
            }
        }
    }
}
