import * as vscode from 'vscode';
import { generateAsyncALineSnippetCommand } from '../../Commands/async/asyncALineCommand';

export function initializeAsyncALineRule(context: vscode.ExtensionContext) {

	const asyncALineCompletionProvider = vscode.languages.registerCompletionItemProvider(
		{ language: 'csharp' },
		{
			provideCompletionItems(document, position) {
				const asyncALineSnippet = new vscode.CompletionItem('asyncA', vscode.CompletionItemKind.Snippet);
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
		'.asyncA'
	);

	context.subscriptions.push(asyncALineCompletionProvider, generateAsyncALineSnippetCommand);
}
