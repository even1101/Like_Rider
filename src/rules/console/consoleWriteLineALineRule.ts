import * as vscode from 'vscode';
import { generateConsoleWriteLineALineSnippetCommand } from '../../Commands/console/consoleWriteLineALineCommand';

export function initializeConsoleWrieLineALineRule(context: vscode.ExtensionContext) {
    // Register suggestions when typing .returnA
    const consoleWrieLineALineCompletionProvider = vscode.languages.registerCompletionItemProvider(
        { language: 'csharp' },
        {
            provideCompletionItems(document, position) {
                const returnALineSnippet = new vscode.CompletionItem('cwA', vscode.CompletionItemKind.Snippet);
                returnALineSnippet.command = {
                    command: 'extension.generateConsoleWriteLineALineSnippet',
                    title: 'Generate Console.WrieLineA method',
                    arguments: [document, position]
                };
                returnALineSnippet.detail = 'Generate returnA method';
                returnALineSnippet.documentation = 'Quickly generate C# returnA method';
                return [returnALineSnippet];
            }
        },
        '.cwA'
    );

    context.subscriptions.push(consoleWrieLineALineCompletionProvider, generateConsoleWriteLineALineSnippetCommand);
}
