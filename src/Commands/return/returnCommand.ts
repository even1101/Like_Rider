import * as vscode from 'vscode';
import { RetrunSnipeetHandler } from '../../handler/ReturnSnippetHandler';

export const generateReturnSnippetCommand = vscode.commands.registerCommand('extension.generateReturnSnippet', async (document, position) => {
	const handler = new RetrunSnipeetHandler(document, position);
	await handler.TriggerAsync();
});