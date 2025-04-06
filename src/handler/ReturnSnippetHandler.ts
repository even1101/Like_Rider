import * as vscode from 'vscode';
import { BaseSnippetHandler } from "./BaseSnippetHandler";

export class RetrunSnipeetHandler extends BaseSnippetHandler {

    constructor(
        document: vscode.TextDocument,
        position: vscode.Position
    ) {
        super(document, position, ".", "return");
    }
    GetSnippetString(expressionText: string): string {
        return `return ${expressionText};`;
    }
}