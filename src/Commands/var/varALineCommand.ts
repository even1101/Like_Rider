import * as vscode from 'vscode';
import { VarALineSnipeetHandler } from '../../handler/line/VarALineSnipeetHandler';
export const generateVarALineSnippetCommand = vscode.commands.registerCommand('extension.generateVarALineSnippet', async (document) => {
	const handler = new VarALineSnipeetHandler(document);
	await handler.TriggerAsync();
});
