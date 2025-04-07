import * as vscode from 'vscode';
import { ForeachSnipeetHandler } from '../../handler/line/ForeachSnipeetHandler';

export const generateForeachSnippetCommand = vscode.commands.registerCommand('extension.generateForeachSnippet', async (document) => {
        const handler = new ForeachSnipeetHandler(document);
        await handler.TriggerAsync();
});
