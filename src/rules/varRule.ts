import * as vscode from 'vscode';
import { generateVarSnippetCommand } from '../Commands/varCommand';

export function initializeVarRule(context: vscode.ExtensionContext) {
	console.log('初始化 .var 規則');

	// 註冊當輸入 .var 時的建議
	const varCompletionProvider = vscode.languages.registerCompletionItemProvider(
		{ language: 'csharp' },
		{
			provideCompletionItems(document, position) {
				const varSnippet = new vscode.CompletionItem('var', vscode.CompletionItemKind.Snippet);
				varSnippet.command = {
					command: 'extension.generateVarSnippet',
					title: '產生 var 語句',
					arguments: [document, position]
				};
				varSnippet.detail = '產生 var 語句';
				varSnippet.documentation = '快速產生 C# 的 var 語句';
				return [varSnippet];
			}
		},
		'.var'
	);

	context.subscriptions.push(varCompletionProvider, generateVarSnippetCommand);
}
