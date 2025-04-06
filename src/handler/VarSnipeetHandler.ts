import * as vscode from 'vscode';
import { BaseSnippetHandler } from "./BaseSnippetHandler";

export class VarSnipeetHandler extends BaseSnippetHandler {

    constructor(
        document: vscode.TextDocument,
        position: vscode.Position
    ) {
        super(document, ".", "var");
    }
    GetSnippetString(expressionText: string): string {
        return `var \${1:myVar} = ${expressionText};\${0}`;
    }
}