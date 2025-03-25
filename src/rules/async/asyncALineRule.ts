import * as vscode from 'vscode';
import { generateAsyncALineSnippetCommand } from '../../Commands/async/asyncALineCommand';

export function initializeAsyncALineRule(context: vscode.ExtensionContext) {
	console.log('初始化 .asyncALine 規則');

	const asyncALineCompletionProvider = vscode.languages.registerCompletionItemProvider(
		{ language: 'csharp' },
		{
			provideCompletionItems(document, position) {
				const asyncALineSnippet = new vscode.CompletionItem('asyncALine', vscode.CompletionItemKind.Snippet);
				asyncALineSnippet.command = {
					command: 'extension.generateAsyncALineSnippet',
					title: '產生 async 方法',
					arguments: [document, position]
				};
				asyncALineSnippet.detail = '產生 async 方法';
				asyncALineSnippet.documentation = '快速產生 C# 的 async 方法';
				return [asyncALineSnippet];
			}
		},
		'.asynca'
	);

	context.subscriptions.push(asyncALineCompletionProvider, generateAsyncALineSnippetCommand);
}
