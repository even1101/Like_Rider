import * as vscode from 'vscode';
import { generateAwaitALineSnippetCommand } from '../../Commands/await/awaitALineCommand';

export function initializeAwaitALineRule(context: vscode.ExtensionContext) {
	// Register suggestions when typing .awaitA
	const awaitALineCompletionProvider = vscode.languages.registerCompletionItemProvider(
		{ language: 'csharp' },
		{
			provideCompletionItems(document, position) {
				const awaitALineSnippet = new vscode.CompletionItem('awaitA', vscode.CompletionItemKind.Snippet);
				awaitALineSnippet.command = {
					command: 'extension.generateAwaitALineSnippet',
					title: 'Generate awaitA method',
					arguments: [document, position]
				};
				awaitALineSnippet.detail = 'Generate awaitA method';
				awaitALineSnippet.documentation = 'Quickly generate C# awaitA method';
				return [awaitALineSnippet];
			}
		},
		'.awaitA'
	);

	context.subscriptions.push(awaitALineCompletionProvider, generateAwaitALineSnippetCommand);
}
