import * as vscode from 'vscode';
import { BaseALineSnippetHandler } from "./BaseALineSnippetHandler";

export class ReturnALineSnipeetHandler extends BaseALineSnippetHandler {
    GetSnippetString(leadingWhitespace: string, codeStart: string): string {
        return `return \${1:}${codeStart};\${2:}`;
    }

    constructor(
        document: vscode.TextDocument
    ) {
        super(document, ".", "returnA");
    }

}