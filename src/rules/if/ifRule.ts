import * as vscode from 'vscode';
import { generateIfSnippetCommand } from '../../Commands/if/ifCommand';

export function initializeIfRule(context: vscode.ExtensionContext) {
	console.log('Initialize .if rule');

	// Register suggestions when typing .if
	const ifCompletionProvider = vscode.languages.registerCompletionItemProvider(
		{ language: 'csharp' }, // Enable only in C# files
		{
			provideCompletionItems(document, position) {
				// Create suggestion item for .if
				const ifSnippet = new vscode.CompletionItem('if', vscode.CompletionItemKind.Snippet);

				// Execute code generation logic when .if is selected
				ifSnippet.command = {
					command: 'extension.generateIfSnippet',
					title: 'Generate if conditional statement',
					arguments: [document, position]
				};

				ifSnippet.detail = 'Generate if conditional statement';
				ifSnippet.documentation = 'Quickly generate C# if conditional statement, limited to method scope';

				return [ifSnippet];
			}
		},
		'.if' // Trigger suggestion with this character
	);

	// Register command to handle code generation logic
	context.subscriptions.push(ifCompletionProvider, generateIfSnippetCommand);
}
