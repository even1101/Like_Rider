import * as vscode from 'vscode';

export const generateAwaitSnippetCommand = vscode.commands.registerCommand('extension.generateAwaitSnippet', (document, position) => {
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		vscode.window.showInformationMessage('分析結果:');
		// ...existing code...
	}
});