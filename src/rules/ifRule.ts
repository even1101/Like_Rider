import * as vscode from 'vscode';

export function initializeIfRule(context: vscode.ExtensionContext) {
	console.log('初始化 .if 規則');

	// 註冊當輸入 .if 時的建議
	const ifCompletionProvider = vscode.languages.registerCompletionItemProvider(
		{ language: 'csharp' }, // 只在 C# 檔案中啟用
		{
			provideCompletionItems(document, position) {
				// 建立 .if 的建議項目
				const ifSnippet = new vscode.CompletionItem('.if', vscode.CompletionItemKind.Snippet);
				ifSnippet.insertText = new vscode.SnippetString('if (${1:condition}) {\n\t$0\n}');
				ifSnippet.detail = '產生 if 條件語句';
				ifSnippet.documentation = '快速產生 C# 的 if 條件語句';

				return [ifSnippet];
			}
		},
		'.' // 觸發建議的字元
	);

	context.subscriptions.push(ifCompletionProvider);
}
