import * as vscode from "vscode";
import { MinecraftJsonSchema } from "../../../types/minecraftJsonSchema";
import { getMatchingSchemas } from "../utils/schemaMatching";
import { parseTree } from "jsonc-parser";
import { getNodeFromOffset } from "../utils/ast";
import { extractHoverInfo } from "./schemaHoverInfo";

export function doHover(document: vscode.TextDocument, position: vscode.Position, schema: MinecraftJsonSchema): vscode.Hover | null {
    const offset = document.offsetAt(position);
    const rootNode = parseTree(document.getText());
    let node = getNodeFromOffset(rootNode, offset);
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

    const infos = getMatchingSchemas(schema, document, rootNode)
        .filter(s => s.node === node && !s.inverted && s.schema)
        .map(s => extractHoverInfo(s.schema))
        .filter(Boolean);

    if (!infos.length) return null;

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