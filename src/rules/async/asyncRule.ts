import * as vscode from 'vscode';
import { generateAsyncSnippetCommand } from '../../Commands/async/asyncCommand';

export function initializeAsyncRule(context: vscode.ExtensionContext) {
	console.log('初始化 .async 規則');

	const asyncCompletionProvider = vscode.languages.registerCompletionItemProvider(
		{ language: 'csharp' },
		{
			provideCompletionItems(document, position) {
				const asyncSnippet = new vscode.CompletionItem('async', vscode.CompletionItemKind.Snippet);
				asyncSnippet.command = {
					command: 'extension.generateAsyncSnippet',
					title: '產生 async 方法',
					arguments: [document, position]
				};
				asyncSnippet.detail = '產生 async 方法';
				asyncSnippet.documentation = '快速產生 C# 的 async 方法';
				return [asyncSnippet];
			}
		},
		'.async'
	);

	context.subscriptions.push(asyncCompletionProvider, generateAsyncSnippetCommand);
}
