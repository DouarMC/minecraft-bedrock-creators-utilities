import { MinecraftJsonSchema } from "../../../types/minecraftJsonSchema";
import { toMarkdown } from "../utils/markdownHelpers";

export interface HoverInfo {
    description?: string;
    experimentalOptions?: string[];
    localized?: boolean;
}

export function extractHoverInfo(schema: MinecraftJsonSchema): HoverInfo | null {
    const info: HoverInfo = {};

    if (schema.description) {
        info.description = toMarkdown(schema.description);
    }

    if (schema["x-experimental_options"]) {
        info.experimentalOptions = schema["x-experimental_options"];
    }

    if (schema["x-localized"]) {
        info.localized = true;
    }

    return Object.keys(info).length ? info : null;
}
