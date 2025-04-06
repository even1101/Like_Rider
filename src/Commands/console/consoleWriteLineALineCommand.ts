import * as vscode from 'vscode';
import { ConsoleWriteLineALineSnipeetHandler } from '../../handler/line/ConsoleWriteLineALineSnippetHandler';

export const generateConsoleWriteLineALineSnippetCommand = vscode.commands.registerCommand('extension.generateConsoleWriteLineALineSnippet', async (document) => {
        const handler = new ConsoleWriteLineALineSnipeetHandler(document);
        await handler.TriggerAsync();
});
