import * as vscode from 'vscode';

export const generateTaskSnippetCommand = vscode.commands.registerCommand('extension.generateTaskSnippet', (document, position) => {
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		vscode.window.showInformationMessage('產生 Task 方法的程式碼片段');
		// ...在這裡加入程式碼產生邏輯...
	}
});
