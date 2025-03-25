import * as vscode from 'vscode';
import { generateTaskALineSnippetCommand } from '../../Commands/task/taskALineCommand';

export function initializeTaskALineRule(context: vscode.ExtensionContext) {
	// Register suggestions when typing .taskA
	const taskALineCompletionProvider = vscode.languages.registerCompletionItemProvider(
		{ language: 'csharp' },
		{
			provideCompletionItems(document, position) {
				const taskALineSnippet = new vscode.CompletionItem('taskA', vscode.CompletionItemKind.Snippet);
				taskALineSnippet.command = {
					command: 'extension.generateTaskALineSnippet',
					title: 'Generate taskA method',
					arguments: [document, position]
				};
				taskALineSnippet.detail = 'Generate taskA method';
				taskALineSnippet.documentation = 'Quickly generate C# taskA method';
				return [taskALineSnippet];
			}
		},
		'.taskA'
	);

	context.subscriptions.push(taskALineCompletionProvider, generateTaskALineSnippetCommand);
}
