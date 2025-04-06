import * as vscode from 'vscode';
import { IfALineSnipeetHandler } from '../../handler/line/IfALineSnipeetHandler';

export const generateIfALineSnippetCommand = vscode.commands.registerCommand('extension.generateIfALineSnippet', async (document) => {
        const handler = new IfALineSnipeetHandler(document);
        await handler.TriggerAsync();
});
