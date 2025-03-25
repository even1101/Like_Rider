import * as vscode from 'vscode';
import { generateVarSnippetCommand } from '../../Commands/var/varCommand';

export function initializeVarRule(context: vscode.ExtensionContext) {
	console.log('Initialize .var rule');

	// Register suggestions when typing .var
	const varCompletionProvider = vscode.languages.registerCompletionItemProvider(
		{ language: 'csharp' },
		{
			provideCompletionItems(document, position) {
				const varSnippet = new vscode.CompletionItem('var', vscode.CompletionItemKind.Snippet);
				varSnippet.command = {
					command: 'extension.generateVarSnippet',
					title: 'Generate var statement',
					arguments: [document, position]
				};
				varSnippet.detail = 'Generate var statement';
				varSnippet.documentation = 'Quickly generate C# var statement';
				return [varSnippet];
			}
		},
		'.var'
	);

	context.subscriptions.push(varCompletionProvider, generateVarSnippetCommand);
}
