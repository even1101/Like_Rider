import * as vscode from 'vscode';
import { BaseALineSnippetHandler } from "./BaseALineSnippetHandler";

export class ForSnipeetHandler extends BaseALineSnippetHandler {
    GetSnippetString(leadingWhitespace: string, codeStart: string): string {
        return `for(\${1:var} \${2:i} = \${3:0}; \${2:i} \${4:<} ${codeStart}; \${2:i}\${5:++})\r{\r\t\${6:}${leadingWhitespace}\r}`;
    }

    constructor(
        document: vscode.TextDocument
    ) {
        super(document, ".", "for");
    }

}