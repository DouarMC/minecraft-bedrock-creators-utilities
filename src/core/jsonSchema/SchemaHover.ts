import * as vscode from 'vscode';
import { MinecraftJsonSchema } from '../../../common/types/MinecraftJsonSchema';
import * as JsonParser from 'jsonc-parser';
import { SchemaUtils } from './SchemaUtils';

interface HoverInfo {
    description?: string;
    experimentalOptions?: string[];
    localized?: boolean;
}

export class SchemaHover {
    public static doHover(document: vscode.TextDocument, position: vscode.Position, schema: MinecraftJsonSchema): vscode.Hover | null {
        const offset = document.offsetAt(position);
        const rootNode = JsonParser.parseTree(document.getText());
        let node = SchemaUtils.getNodeFromOffset(rootNode, offset);
        if (!node || ((node.type === "object" || node.type === "array") && offset > node.offset + 1 && offset < node.offset + node.length - 1)) {
            return null;
        }

        const hoverRangeNode = node;

        // si on est sur une clé, on déplace vers sa valeur
        if (node.type === "string" && node.parent?.type === "property" && node.parent.children?.[0] === node) {
            node = node.parent.children[1];
            if (!node) return null;
        }

        const hoverRange = new vscode.Range(
            document.positionAt(hoverRangeNode.offset),
            document.positionAt(hoverRangeNode.offset + hoverRangeNode.length)
        );

        const infos = SchemaUtils.getMatchingSchemas(schema, document, rootNode)
            .filter(s => s.node === node && !s.inverted && s.schema)
            .map(s => this.extractHoverInfo(s.schema))
            .filter(Boolean);
        
        if (! infos.length) return null;

        const markdownLines: string[] = [];
        for (const info of infos) {
            if (info?.experimentalOptions) {
                markdownLines.push(`**Options expérimentales** : ${info.experimentalOptions.join(", ")}`);
            }
            if (info?.localized) {
                markdownLines.push("**Texte Traduisable**");
            }
            if (info?.description) {
                markdownLines.push("", info.description); // saut de ligne avant description
            }
        }

        return new vscode.Hover([new vscode.MarkdownString(markdownLines.join("\n"), true)], hoverRange);
    }

    public static extractHoverInfo(schema: MinecraftJsonSchema): HoverInfo | null {
        const info: HoverInfo = {};

        if (schema.description) {
            info.description = schema.description;
        }

        if (schema["x-experimental_options"]) {
            info.experimentalOptions = schema["x-experimental_options"];
        }

        if (schema["x-localized"]) {
            info.localized = true;
        }

        return Object.keys(info).length ? info : null;
    }
}