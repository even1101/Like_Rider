import * as vscode from 'vscode';
import { BaseALineSnippetHandler } from "./BaseALineSnippetHandler";

export class ConsoleWriteLineALineSnipeetHandler extends BaseALineSnippetHandler {
    GetSnippetString(leadingWhitespace: string, codeStart: string): string {
        return `Console.WriteLint(${codeStart}\${1:});\${2:}`;
    }

    constructor(
        document: vscode.TextDocument
    ) {
        super(document, ".", "cwA");
    }

}