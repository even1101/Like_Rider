import * as vscode from 'vscode';

export const generateVarSnippetCommand = vscode.commands.registerCommand('extension.generateVarSnippet', (document, position) => {
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		// ...existing code...
	}
});