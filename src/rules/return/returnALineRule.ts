import * as vscode from 'vscode';
import { generateReturnALineSnippetCommand } from '../../Commands/return/returnALineCommand';

export function initializeReturnALineRule(context: vscode.ExtensionContext) {
	// Register suggestions when typing .returnA
	const returnALineCompletionProvider = vscode.languages.registerCompletionItemProvider(
		{ language: 'csharp' },
		{
			provideCompletionItems(document, position) {
				const returnALineSnippet = new vscode.CompletionItem('returnA', vscode.CompletionItemKind.Snippet);
				returnALineSnippet.command = {
					command: 'extension.generateReturnALineSnippet',
					title: 'Generate returnA method',
					arguments: [document, position]
				};
				returnALineSnippet.detail = 'Generate returnA method';
				returnALineSnippet.documentation = 'Quickly generate C# returnA method';
				return [returnALineSnippet];
			}
		},
		'.returnA'
	);

	context.subscriptions.push(returnALineCompletionProvider, generateReturnALineSnippetCommand);
}
