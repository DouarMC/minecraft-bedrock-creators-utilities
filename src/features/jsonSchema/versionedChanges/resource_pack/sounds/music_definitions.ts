import { SchemaType } from "../../../../../types/schema";
import { dynamicExamplesSourceKeys } from "../../../shared/schemaEnums";
import { MinecraftJsonSchema } from "../../../types/minecraftJsonSchema";

const baseSchema: MinecraftJsonSchema = {
    description: "Ce fichier sert à créer des références de Musiques à utiliser dans divers contextes.",
    type: "object",
    propertyNames: {
        "x-dynamic-examples-source": dynamicExamplesSourceKeys.data_driven_music_references
    },
    additionalProperties: {
        type: "object",
        required: ["event_name"],
        properties: {
            event_name: {
                description: "La référence de son à utiliser pour cette musique. Les références de son sont définies dans le fichier `sound_definitions.json`.",
                type: "string",
                "x-dynamic-examples-source": dynamicExamplesSourceKeys.sound_references
            },
            min_delay: {
                description: "Le temps minimum en tick avant que la musique se joue/rejoue.",
                type: "integer"
            },
            max_delay: {
                description: "Le temps maximum en tick avant que la musique se joue/rejoue.",
                type: "integer"
            }
        }
    }
};

export const musicDefinitionsSchemaTypeRP: SchemaType = {
    fileMatch: ["**/addon/resource_pack/sounds/music_definitions.json"],
    baseSchema: baseSchema,
    versionedChanges: []
};