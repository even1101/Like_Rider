import * as vscode from 'vscode';
import { generateAwaitSnippetCommand } from '../../Commands/await/awaitCommand';

export function initializeAwaitRule(context: vscode.ExtensionContext) {
	console.log('Initialize .await rule');

	// Register suggestions when typing .await
	const awaitCompletionProvider = vscode.languages.registerCompletionItemProvider(
		{ language: 'csharp' },
		{
			provideCompletionItems(document, position) {
				const awaitSnippet = new vscode.CompletionItem('await', vscode.CompletionItemKind.Snippet);
				awaitSnippet.command = {
					command: 'extension.generateAwaitSnippet',
					title: 'Generate await statement',
					arguments: [document, position]
				};
				awaitSnippet.detail = 'Generate await statement';
				awaitSnippet.documentation = 'Quickly generate C# await statement';
				return [awaitSnippet];
			}
		},
		'.await'
	);

	// Register command to handle code generation logic
	context.subscriptions.push(awaitCompletionProvider, generateAwaitSnippetCommand);
}
