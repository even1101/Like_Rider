import * as vscode from 'vscode';

export const generateAwaitALineSnippetCommand = vscode.commands.registerCommand('extension.generateAwaitALineSnippet', (document, position) => {
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		vscode.window.showInformationMessage('產生 awaitALine 方法的程式碼片段');
		// ...在這裡加入程式碼產生邏輯...
	}
});
