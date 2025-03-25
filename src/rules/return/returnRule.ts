import * as vscode from 'vscode';
import { generateReturnSnippetCommand } from '../../Commands/return/returnCommand';

export function initializeReturnRule(context: vscode.ExtensionContext) {
	console.log('Initialize .return rule');

	// Register suggestions when typing .return
	const returnCompletionProvider = vscode.languages.registerCompletionItemProvider(
		{ language: 'csharp' },
		{
			provideCompletionItems(document, position) {
				const returnSnippet = new vscode.CompletionItem('return', vscode.CompletionItemKind.Snippet);
				returnSnippet.command = {
					command: 'extension.generateReturnSnippet',
					title: 'Generate return statement',
					arguments: [document, position]
				};
				returnSnippet.detail = 'Generate return statement';
				returnSnippet.documentation = 'Quickly generate C# return statement';
				return [returnSnippet];
			}
		},
		'.return'
	);

	// Register command to handle code generation logic
	context.subscriptions.push(returnCompletionProvider, generateReturnSnippetCommand);
}
