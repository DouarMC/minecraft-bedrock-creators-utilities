import * as vscode from 'vscode';
import { MinecraftJsonSchema } from '../../../common/types/MinecraftJsonSchema';
import { SchemaCollectorLike } from './collectors/SchemaCollectorLike';

export interface ValidationContext {
    document: vscode.TextDocument;
    rootSchema: MinecraftJsonSchema;
    collector: SchemaCollectorLike;
}