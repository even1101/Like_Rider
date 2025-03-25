import * as vscode from 'vscode';
import { generateReturnALineSnippetCommand } from '../../Commands/return/returnALineCommand';

export function initializeReturnALineRule(context: vscode.ExtensionContext) {
	console.log('初始化 .returnALine 規則');

	const returnALineCompletionProvider = vscode.languages.registerCompletionItemProvider(
		{ language: 'csharp' },
		{
			provideCompletionItems(document, position) {
				const returnALineSnippet = new vscode.CompletionItem('returnALine', vscode.CompletionItemKind.Snippet);
				returnALineSnippet.command = {
					command: 'extension.generateReturnALineSnippet',
					title: '產生 returnALine 方法',
					arguments: [document, position]
				};
				returnALineSnippet.detail = '產生 returnALine 方法';
				returnALineSnippet.documentation = '快速產生 C# 的 returnALine 方法';
				return [returnALineSnippet];
			}
		},
		'.returnALine'
	);

	context.subscriptions.push(returnALineCompletionProvider, generateReturnALineSnippetCommand);
}
