import * as vscode from 'vscode';
import { generateReturnSnippetCommand } from '../../Commands/return/returnCommand';

export function initializeReturnRule(context: vscode.ExtensionContext) {
	console.log('初始化 .return 規則');

	// 註冊當輸入 .return 時的建議
	const returnCompletionProvider = vscode.languages.registerCompletionItemProvider(
		{ language: 'csharp' },
		{
			provideCompletionItems(document, position) {
				const returnSnippet = new vscode.CompletionItem('return', vscode.CompletionItemKind.Snippet);
				returnSnippet.command = {
					command: 'extension.generateReturnSnippet',
					title: '產生 return 語句',
					arguments: [document, position]
				};
				returnSnippet.detail = '產生 return 語句';
				returnSnippet.documentation = '快速產生 C# 的 return 語句';
				return [returnSnippet];
			}
		},
		'.return'
	);

	// 註冊命令來處理程式碼產生邏輯
	context.subscriptions.push(returnCompletionProvider, generateReturnSnippetCommand);
}
