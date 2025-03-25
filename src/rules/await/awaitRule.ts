import * as vscode from 'vscode';
import { generateAwaitSnippetCommand } from '../../Commands/await/awaitCommand';

export function initializeAwaitRule(context: vscode.ExtensionContext) {
	console.log('初始化 .await 規則');

	// 註冊當輸入 .await 時的建議
	const awaitCompletionProvider = vscode.languages.registerCompletionItemProvider(
		{ language: 'csharp' },
		{
			provideCompletionItems(document, position) {
				const awaitSnippet = new vscode.CompletionItem('await', vscode.CompletionItemKind.Snippet);
				awaitSnippet.command = {
					command: 'extension.generateAwaitSnippet',
					title: '產生 await 語句',
					arguments: [document, position]
				};
				awaitSnippet.detail = '產生 await 語句';
				awaitSnippet.documentation = '快速產生 C# 的 await 語句';
				return [awaitSnippet];
			}
		},
		'.await'
	);

	// 註冊命令來處理程式碼產生邏輯
	context.subscriptions.push(awaitCompletionProvider, generateAwaitSnippetCommand);
}
