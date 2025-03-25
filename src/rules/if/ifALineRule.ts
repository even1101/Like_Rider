import * as vscode from 'vscode';
import { generateIfALineSnippetCommand } from '../../Commands/if/ifALineCommand';

export function initializeIfALineRule(context: vscode.ExtensionContext) {
	console.log('初始化 .ifALine 規則');

	const ifALineCompletionProvider = vscode.languages.registerCompletionItemProvider(
		{ language: 'csharp' },
		{
			provideCompletionItems(document, position) {
				const ifALineSnippet = new vscode.CompletionItem('ifALine', vscode.CompletionItemKind.Snippet);
				ifALineSnippet.command = {
					command: 'extension.generateIfALineSnippet',
					title: '產生 ifALine 方法',
					arguments: [document, position]
				};
				ifALineSnippet.detail = '產生 ifALine 方法';
				ifALineSnippet.documentation = '快速產生 C# 的 ifALine 方法';
				return [ifALineSnippet];
			}
		},
		'.ifALine'
	);

	context.subscriptions.push(ifALineCompletionProvider, generateIfALineSnippetCommand);
}
