import * as vscode from 'vscode';
import { generateAwaitALineSnippetCommand } from '../../Commands/await/awaitALineCommand';

export function initializeAwaitALineRule(context: vscode.ExtensionContext) {
	console.log('初始化 .awaitALine 規則');

	const awaitALineCompletionProvider = vscode.languages.registerCompletionItemProvider(
		{ language: 'csharp' },
		{
			provideCompletionItems(document, position) {
				const awaitALineSnippet = new vscode.CompletionItem('awaitALine', vscode.CompletionItemKind.Snippet);
				awaitALineSnippet.command = {
					command: 'extension.generateAwaitALineSnippet',
					title: '產生 awaitALine 方法',
					arguments: [document, position]
				};
				awaitALineSnippet.detail = '產生 awaitALine 方法';
				awaitALineSnippet.documentation = '快速產生 C# 的 awaitALine 方法';
				return [awaitALineSnippet];
			}
		},
		'.awaitALine'
	);

	context.subscriptions.push(awaitALineCompletionProvider, generateAwaitALineSnippetCommand);
}
