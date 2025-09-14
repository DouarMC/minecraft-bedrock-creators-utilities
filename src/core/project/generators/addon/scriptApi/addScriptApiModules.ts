export function addScriptApiModules(behaviorManifest: any, packageJson: any, modules: Record<string, string>): void {
    behaviorManifest.dependencies = behaviorManifest.dependencies || [];
    for (const [moduleName, moduleVersion] of Object.entries(modules)) {
        const hasDependency = behaviorManifest.dependencies.some((dep: any) => dep.module_name === moduleName);
        if (!hasDependency) {
            behaviorManifest.dependencies.push({
                module_name: moduleName,
                version: moduleVersion
            });
        }
        if (packageJson.dependencies === undefined) {
            packageJson.dependencies = {};
        }
        if (packageJson.dependencies[moduleName] === undefined) {
            packageJson.dependencies[moduleName] = moduleVersion;
        } else if (packageJson.dependencies[moduleName] !== moduleVersion) {
            // Met à jour la version si différente
            packageJson.dependencies[moduleName] = moduleVersion;
        }
    }
}