import * as vscode from 'vscode';
import { findExpressionRange } from '../utils/expressionFinder';
import { removeFirstOccurrenceOnCurrentLineAsync } from '../utils/textUtils';

export abstract class BaseSnippetHandler {

    private readonly _document: vscode.TextDocument;
    private readonly _insertedWord: string;
    private readonly _triggerKeyWord: string;

    abstract GetSnippetString(expressionText: string): string;

    constructor(
        document: vscode.TextDocument,
        triggerChar: string,
        insertedWord: string
    ) {
        this._document = document;
        this._insertedWord = insertedWord;
        this._triggerKeyWord = triggerChar + insertedWord;
    }

    public async TriggerAsync() {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document !== this._document)
        { return; }

        // 計算觸發字符'.'的位置
        const triggerCharPosition = await removeFirstOccurrenceOnCurrentLineAsync(this._triggerKeyWord);
        if (!this.ValidTriggerCharPosition(triggerCharPosition))
        { return; }
    
        // 尋找觸發字符"."之前的表達式範圍
        const expressionRange = findExpressionRange(this._document, triggerCharPosition!);

        if (!this.ValidExpressionRange(expressionRange))
        { return; }

        // 獲取表達式文本
        const expressionText = this._document.getText(expressionRange).trim();

        if (!this.ValidExpressionText(expressionText))
        { return; }
        
        console.log(`${this._triggerKeyWord} Command: 找到表達式文本："${expressionText}"`);
        // 定義要替換的範圍
        const replacementRange = this.DefiningExchangeScope(triggerCharPosition!, expressionRange!);

        // 插入代碼片段
        await this.AddCodeSnippetAsync(editor, replacementRange, expressionText);
    }
    
    private ValidTriggerCharPosition(
        triggerCharPosition: vscode.Position | undefined
    ): boolean { 
        if (!triggerCharPosition) { return false; }
        console.log(`假設觸發有效。計算原始觸發字符'.'位置：行 ${triggerCharPosition.line}, 字元 ${triggerCharPosition.character}`);
        return true;
    }

    private ValidExpressionRange(
        expressionRange: vscode.Range | undefined
    ): boolean { 
        if (!expressionRange) {
            console.log(`${this._insertedWord}Command: findExpressionRange return undefined`);
            return false;
        }

        if (expressionRange.isEmpty) {
            console.warn(`${this._insertedWord}Command: findExpressionRange return empty range`);
            vscode.window.showErrorMessage("在'.'之前找到空表達式範圍");
            return false;
        }
        return true;
    }

    private ValidExpressionText(expressionText: string): boolean { 
        if (!expressionText) {
            console.warn(`${this._insertedWord}Command: 修剪後表達式文本為空`);
            vscode.window.showErrorMessage("在'.'之前找到的表達式為空");
            return false;
        }
        return true;
    }

    private DefiningExchangeScope(
        triggerCharPosition: vscode.Position,
        expressionRange: vscode.Range
    ): vscode.Range {
        const endOfReplacement = triggerCharPosition.translate(0, this._triggerKeyWord.length);
        const replacementRange = new vscode.Range(expressionRange.start, endOfReplacement);
        console.log(`${this._insertedWord}Command: 計算精確替換範圍：[${replacementRange.start.line}, ${replacementRange.start.character}] 到 [${replacementRange.end.line}, ${replacementRange.end.character}]`);
        return replacementRange;
    }

    private async AddCodeSnippetAsync(
        editor: vscode.TextEditor,
        replacementRange: vscode.Range,
        expressionText: string
    ): Promise<void> {
        try {
            await editor.insertSnippet(
                new vscode.SnippetString(this.GetSnippetString(expressionText)),
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