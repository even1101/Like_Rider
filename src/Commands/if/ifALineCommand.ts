import * as vscode from 'vscode';

export const generateIfALineSnippetCommand = vscode.commands.registerCommand('extension.generateIfALineSnippet', async () => {
	const editor = vscode.window.activeTextEditor;
	if (!editor) { return; }

	
});
