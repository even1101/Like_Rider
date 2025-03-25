import * as vscode from 'vscode';
import { generateVarALineSnippetCommand } from '../../Commands/var/varALineCommand';

export function initializeVarALineRule(context: vscode.ExtensionContext) {
	// Register suggestions when typing .varA
	const varALineCompletionProvider = vscode.languages.registerCompletionItemProvider(
		{ language: 'csharp' },
		{
			provideCompletionItems(document, position) {
				const varALineSnippet = new vscode.CompletionItem('varA', vscode.CompletionItemKind.Snippet);
				varALineSnippet.command = {
					command: 'extension.generateVarALineSnippet',
					title: 'Generate varA method',
					arguments: [document, position]
				};
				varALineSnippet.detail = 'Generate varA method';
				varALineSnippet.documentation = 'Quickly generate C# varA method';
				return [varALineSnippet];
			}
		},
		'.varA'
	);

	context.subscriptions.push(varALineCompletionProvider, generateVarALineSnippetCommand);
}
