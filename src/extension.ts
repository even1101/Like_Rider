// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { initializeVarRule } from './rules/varRule';
import { initializeReturnRule } from './rules/returnRule';
import { initializeAwaitRule } from './rules/awaitRule';
import { initializeIfRule } from './rules/ifRule';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "like-rider" is now active!');

	// 監聽編輯器中開啟的檔案
	vscode.workspace.onDidOpenTextDocument((document) => {
		if (document.languageId === 'csharp') {
			
			console.log('檔案為 .cs 副檔名，啟用初始化邏輯');
			// 初始化邏輯規則
			initializeVarRule(context);
			initializeReturnRule(context);
			initializeAwaitRule(context);
			initializeIfRule(context);

			// 自動執行初始化程式碼
			vscode.window.showInformationMessage('Like Rider 已啟用並執行初始化程式碼！');
		} else {
			console.log('檔案非 .cs 副檔名，跳過初始化');
		}
	});
	// context.subscriptions.push(l);
}

// This method is called when your extension is deactivated
export function deactivate() {}
