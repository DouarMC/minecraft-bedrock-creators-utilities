export interface AddonPackageJson {
    name: string;
    version: string;
    description?: string;
    license?: string;
    type?: "module" | "commonjs";
    dependencies: Record<string, string>;
    devDependencies?: Record<string, string>;
    scripts?: Record<string, string>;
}