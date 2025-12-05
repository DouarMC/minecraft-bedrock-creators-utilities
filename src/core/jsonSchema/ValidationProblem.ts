import * as vscode from 'vscode';
import { ErrorCode } from './ErrorCode';

export interface ValidationProblem {
    location: vscode.Range;
    severity?: vscode.DiagnosticSeverity;
    code?: ErrorCode;
    message: string;
}