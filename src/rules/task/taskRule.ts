import * as vscode from 'vscode';
import { generateTaskSnippetCommand } from '../../Commands/task/taskCommand';

export function initializeTaskRule(context: vscode.ExtensionContext) {
	console.log('Initialize .task rule');

	// Register suggestions when typing .task
	const taskCompletionProvider = vscode.languages.registerCompletionItemProvider(
		{ language: 'csharp' },
		{
			provideCompletionItems(document, position) {
				const taskSnippet = new vscode.CompletionItem('task', vscode.CompletionItemKind.Snippet);
				taskSnippet.command = {
					command: 'extension.generateTaskSnippet',
					title: 'Generate Task method',
					arguments: [document, position]
				};
				taskSnippet.detail = 'Generate Task method';
				taskSnippet.documentation = 'Quickly generate C# Task method';
				return [taskSnippet];
			}
		},
		'.task'
	);

	context.subscriptions.push(taskCompletionProvider, generateTaskSnippetCommand);
}
