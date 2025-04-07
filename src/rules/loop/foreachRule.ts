import * as vscode from 'vscode';
import { generateForeachSnippetCommand } from '../../Commands/loop/foreachCommand';

export function initializeForeachRule(context: vscode.ExtensionContext) {
    // Register suggestions when typing .foreach
    const foreachCompletionProvider = vscode.languages.registerCompletionItemProvider(
        { language: 'csharp' },
        {
            provideCompletionItems(document, position) {
                const foreachSnippet = new vscode.CompletionItem('foreach', vscode.CompletionItemKind.Snippet);
                foreachSnippet.command = {
                    command: 'extension.generateForeachSnippet',
                    title: 'Generate foreach method',
                    arguments: [document, position]
                };
                foreachSnippet.detail = 'Generate foreach method';
                foreachSnippet.documentation = 'Quickly generate C# foreach method';
                return [foreachSnippet];
            }
        },
        '.foreach'
    );

    context.subscriptions.push(foreachCompletionProvider, generateForeachSnippetCommand);
}
