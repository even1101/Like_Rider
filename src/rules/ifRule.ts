import * as vscode from 'vscode';

export function initializeIfRule(context: vscode.ExtensionContext) {
	console.log('初始化 .if 規則');

	// 註冊當輸入 .if 時的建議
	const ifCompletionProvider = vscode.languages.registerCompletionItemProvider(
		{ language: 'csharp' }, // 只在 C# 檔案中啟用
		{
			provideCompletionItems(document, position) {
				// 建立 .if 的建議項目
				const ifSnippet = new vscode.CompletionItem('if', vscode.CompletionItemKind.Snippet);

				// 當選擇 .if 時才執行程式碼產生邏輯
				ifSnippet.command = {
					command: 'extension.generateIfSnippet',
					title: '產生 if 條件語句',
					arguments: [document, position]
				};

				ifSnippet.detail = '產生 if 條件語句';
				ifSnippet.documentation = '快速產生 C# 的 if 條件語句，僅限於 method 的內容範圍內';

				return [ifSnippet];
			}
		},
		'.if' // 觸發建議的字元
	);

	// 註冊命令來處理程式碼產生邏輯
	const generateIfSnippetCommand = vscode.commands.registerCommand('extension.generateIfSnippet', (document, position) => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			// do something.
		}
	});



	context.subscriptions.push(ifCompletionProvider, generateIfSnippetCommand);
}
