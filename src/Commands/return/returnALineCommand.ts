import * as vscode from 'vscode';
import { ReturnALineSnipeetHandler } from "../../handler/line/ReturnALineSnippetHandler";

export const generateReturnALineSnippetCommand = vscode.commands.registerCommand('extension.generateReturnALineSnippet', async (document) => {
	const handler = new ReturnALineSnipeetHandler(document);
	await handler.TriggerAsync();
});
