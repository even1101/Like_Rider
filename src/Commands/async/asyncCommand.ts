import * as vscode from 'vscode';

export const generateAsyncSnippetCommand = vscode.commands.registerCommand('extension.generateAsyncSnippet', (document, position) => {
	const editor = vscode.window.activeTextEditor;
	if (editor) {
		vscode.window.showInformationMessage('產生 async 方法的程式碼片段');
		// ...在這裡加入程式碼產生邏輯...
	}
});
