export const schemaPatterns = {
    animation_timeline_keyframe: "^([0-9]+(\.[0-9]+)?)$",
    atmospherics_keyframe: "^(0(\.\d+)?|1(\.0+)?)$",
    color_hex_rgba: "^#[0-9a-fA-F]{8}$",
    lighting_keyframe: "^(0(\.\d+)?|1(\.0+)?)$",
    particle_lifetime_keyframe: "^[0-9]+(\\.[0-9]+)?$",
    render_controller_identifier: "^controller\\.render\\.",

    identifier_with_namespace: "^[a-z0-9_\\-]+:[a-zA-Z0-9_.\\-]+$",
    loot_tables_file: "^loot_tables\\/.*\\.json$",
    trading_file: "^trading\\/.*\\.json$",
    color_hex: "^#[0-9a-fA-F]{6}$",
    culling_layer_identifier: "^[a-z0-9_\\-]+:culling_layer\\.[a-z0-9_\\-]+$",
    animation_controller_identifier: "^controller\\.animation\\.",
    animation_identifier: "^animation\\.",
    uuid: "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$",
    version: "^(\\d+\\.)?(\\d+\\.)?(\\*|\\d+)$",
    script_version: "^[0-9]+\\.[0-9]+\\.[0-9]+(-beta)?$"
};