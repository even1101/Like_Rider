import * as vscode from 'vscode';

export const generateIfSnippetCommand = vscode.commands.registerCommand('extension.generateIfSnippet', (document, position) => {
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		// do something.
	}
});