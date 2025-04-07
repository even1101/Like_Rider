import * as vscode from 'vscode';
import { generateForSnippetCommand } from '../../Commands/loop/forCommand';

export function initializeForRule(context: vscode.ExtensionContext) {
    // Register suggestions when typing .foreach
    const foreachCompletionProvider = vscode.languages.registerCompletionItemProvider(
        { language: 'csharp' },
        {
            provideCompletionItems(document, position) {
                const forSnippet = new vscode.CompletionItem('for', vscode.CompletionItemKind.Snippet);
                forSnippet.command = {
                    command: 'extension.generateForSnippet',
                    title: 'Generate for method',
                    arguments: [document, position]
                };
                forSnippet.detail = 'Generate for method';
                forSnippet.documentation = 'Quickly generate C# for method';
                return [forSnippet];
            }
        },
        '.for'
    );

    context.subscriptions.push(foreachCompletionProvider, generateForSnippetCommand);
}
