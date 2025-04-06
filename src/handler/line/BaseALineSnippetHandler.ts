import * as vscode from 'vscode';
import {
    removeFirstOccurrenceOnCurrentLineAsync,
    extractMeaningfulText
} from '../../utils/textUtils';


export abstract class BaseALineSnippetHandler {

    private readonly _document: vscode.TextDocument;
    private readonly _triggerKeyWord: string;

    abstract GetSnippetString(leadingWhitespace: string, codeStart: string): string;

    constructor(
        document: vscode.TextDocument,
        triggerChar: string,
        insertedWord: string
    ) {
        this._document = document;
        this._triggerKeyWord = triggerChar + insertedWord;
    }

    public async TriggerAsync() {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document !== this._document) { return; }
        
        // 計算觸發字符'.'的位置
        const triggerCharPosition = await removeFirstOccurrenceOnCurrentLineAsync(this._triggerKeyWord);
        if (!this.ValidTriggerCharPosition(triggerCharPosition)) { return; }

        const selection = editor.selection;
	    const position = selection.active;

	    const lineText = this._document.lineAt(position.line).text;

	    const match = lineText.match(/^(.*?)(\S.*)$/);
	    if (!match) { return; }

	    const leadingWhitespace = match[1]; // 前置空白
	    const codeStart = match[2]; // 非空白的程式碼部分
        const currentLineNumber = editor.selection.active.line;
        
        await removeFirstOccurrenceOnCurrentLineAsync(codeStart);
        
        const startPosition = new vscode.Position(currentLineNumber, leadingWhitespace.length + codeStart.length);
        const replacementRange = new vscode.Range(startPosition!, triggerCharPosition!);
        
        
        const snippet = this.GetSnippetString(leadingWhitespace, codeStart);
        await this.AddCodeSnippetAsync(editor, replacementRange, snippet);

    }
    private ValidTriggerCharPosition(
        triggerCharPosition: vscode.Position | undefined
    ): boolean {
        if (!triggerCharPosition) { return false; }
        console.log(`假設觸發有效。計算原始觸發字符'.'位置：行 ${triggerCharPosition.line}, 字元 ${triggerCharPosition.character}`);
        return true;
    }


    private async AddCodeSnippetAsync(
        editor: vscode.TextEditor,
        replacementRange: vscode.Range,
        snippetString: string
    ): Promise<void> {
        try {
            await editor.insertSnippet(
                new vscode.SnippetString(snippetString),
                replacementRange,
                { undoStopBefore: true, undoStopAfter: true }
            );
            console.log(`${this._triggerKeyWord} Command: 代碼片段插入成功`);
        } catch (error) {
            console.error(`${this._triggerKeyWord} Command: 插入代碼片段失敗:`, error);
            vscode.window.showErrorMessage(`插入'${this._triggerKeyWord}'代碼片段時出錯`);
        }
    }
}