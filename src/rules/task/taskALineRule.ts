import * as vscode from 'vscode';
import { generateTaskALineSnippetCommand } from '../../Commands/task/taskALineCommand';

export function initializeTaskALineRule(context: vscode.ExtensionContext) {
	console.log('初始化 .taskALine 規則');

	const taskALineCompletionProvider = vscode.languages.registerCompletionItemProvider(
		{ language: 'csharp' },
		{
			provideCompletionItems(document, position) {
				const taskALineSnippet = new vscode.CompletionItem('taskALine', vscode.CompletionItemKind.Snippet);
				taskALineSnippet.command = {
					command: 'extension.generateTaskALineSnippet',
					title: '產生 taskALine 方法',
					arguments: [document, position]
				};
				taskALineSnippet.detail = '產生 taskALine 方法';
				taskALineSnippet.documentation = '快速產生 C# 的 taskALine 方法';
				return [taskALineSnippet];
			}
		},
		'.taskALine'
	);

	context.subscriptions.push(taskALineCompletionProvider, generateTaskALineSnippetCommand);
}
