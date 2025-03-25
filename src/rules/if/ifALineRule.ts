import * as vscode from 'vscode';
import { generateIfALineSnippetCommand } from '../../Commands/if/ifALineCommand';

export function initializeIfALineRule(context: vscode.ExtensionContext) {
	// Register suggestions when typing .ifA
	const ifALineCompletionProvider = vscode.languages.registerCompletionItemProvider(
		{ language: 'csharp' },
		{
			provideCompletionItems(document, position) {
				const ifALineSnippet = new vscode.CompletionItem('ifA', vscode.CompletionItemKind.Snippet);
				ifALineSnippet.command = {
					command: 'extension.generateIfALineSnippet',
					title: 'Generate ifA method',
					arguments: [document, position]
				};
				ifALineSnippet.detail = 'Generate ifA method';
				ifALineSnippet.documentation = 'Quickly generate C# ifA method';
				return [ifALineSnippet];
			}
		},
		'.ifA'
	);

	context.subscriptions.push(ifALineCompletionProvider, generateIfALineSnippetCommand);
}
