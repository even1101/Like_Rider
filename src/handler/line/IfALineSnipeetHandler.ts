import * as vscode from 'vscode';
import { BaseALineSnippetHandler } from "./BaseALineSnippetHandler";

export class IfALineSnipeetHandler extends BaseALineSnippetHandler {
    GetSnippetString(leadingWhitespace: string, codeStart: string): string {
        return `if(${codeStart})\r{\r\t\${1:}${leadingWhitespace}\r}`;
    }

    constructor(
        document: vscode.TextDocument
    ) {
        super(document, ".", "ifA");
    }

}