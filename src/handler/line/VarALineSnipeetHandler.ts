import * as vscode from 'vscode';
import { BaseALineSnippetHandler } from "./BaseALineSnippetHandler";

export class VarALineSnipeetHandler extends BaseALineSnippetHandler {
    GetSnippetString(leadingWhitespace: string, codeStart: string): string {
        return `var \${1:myVar} = ${codeStart};\${0}`;
    }

    constructor(
        document: vscode.TextDocument
    ) {
        super(document, ".", "varA");
    }

}