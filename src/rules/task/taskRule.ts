import * as vscode from 'vscode';
import { generateTaskSnippetCommand } from '../../Commands/task/taskCommand';

export function initializeTaskRule(context: vscode.ExtensionContext) {
	console.log('初始化 .task 規則');

	const taskCompletionProvider = vscode.languages.registerCompletionItemProvider(
		{ language: 'csharp' },
		{
			provideCompletionItems(document, position) {
				const taskSnippet = new vscode.CompletionItem('task', vscode.CompletionItemKind.Snippet);
				taskSnippet.command = {
					command: 'extension.generateTaskSnippet',
					title: '產生 Task 方法',
					arguments: [document, position]
				};
				taskSnippet.detail = '產生 Task 方法';
				taskSnippet.documentation = '快速產生 C# 的 Task 方法';
				return [taskSnippet];
			}
		},
		'.task'
	);

	context.subscriptions.push(taskCompletionProvider, generateTaskSnippetCommand);
}
