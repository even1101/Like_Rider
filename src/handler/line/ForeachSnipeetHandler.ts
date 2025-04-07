import * as vscode from 'vscode';
import { BaseALineSnippetHandler } from "./BaseALineSnippetHandler";

export class ForeachSnipeetHandler extends BaseALineSnippetHandler {
    GetSnippetString(leadingWhitespace: string, codeStart: string): string {
        return `foreach(\${1:var} \${2:item} in ${codeStart})\r{\r\t\${3:}${leadingWhitespace}\r}`;
    }

    constructor(
        document: vscode.TextDocument
    ) {
        super(document, ".", "foreach");
    }

}