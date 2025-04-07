import * as vscode from 'vscode';
import { ForSnipeetHandler } from '../../handler/line/ForSnipeetHandler';

export const generateForSnippetCommand = vscode.commands.registerCommand('extension.generateForSnippet', async (document) => {
        const handler = new ForSnipeetHandler(document);
        await handler.TriggerAsync();
});
