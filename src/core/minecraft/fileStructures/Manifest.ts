export interface Manifest {
    format_version: number;
    header: {
        name: string;
        description?: string;
        uuid: string;
        version: [number, number, number];
    }
    modules: Array<{
        type: "data" | "script" | "resources" | "skin_pack" | "world_template";
        uuid: string;
        version: [number, number, number];
    }>
}