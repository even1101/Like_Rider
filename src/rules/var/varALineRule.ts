import * as vscode from 'vscode';
import { generateVarALineSnippetCommand } from '../../Commands/var/varALineCommand';

export function initializeVarALineRule(context: vscode.ExtensionContext) {
	console.log('初始化 .varALine 規則');

	const varALineCompletionProvider = vscode.languages.registerCompletionItemProvider(
		{ language: 'csharp' },
		{
			provideCompletionItems(document, position) {
				const varALineSnippet = new vscode.CompletionItem('varALine', vscode.CompletionItemKind.Snippet);
				varALineSnippet.command = {
					command: 'extension.generateVarALineSnippet',
					title: '產生 varALine 方法',
					arguments: [document, position]
				};
				varALineSnippet.detail = '產生 varALine 方法';
				varALineSnippet.documentation = '快速產生 C# 的 varALine 方法';
				return [varALineSnippet];
			}
		},
		'.varALine'
	);

	context.subscriptions.push(varALineCompletionProvider, generateVarALineSnippetCommand);
}
