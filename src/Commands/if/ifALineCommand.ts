import * as vscode from 'vscode';

export const generateIfALineSnippetCommand = vscode.commands.registerCommand('extension.generateIfALineSnippet', async () => {
	const editor = vscode.window.activeTextEditor;
	if (!editor) { return; }

	const document = editor.document;
	const selection = editor.selection;
	const position = selection.active;

	
	const lineText = document.lineAt(position.line).text;

	
	const match = lineText.match(/^(.*?)(\S.*)$/);
	if (!match) { return; }

	const leadingWhitespace = match[1]; // 前置空白
	const codeStart = match[2]; // 非空白的程式碼部分

	// dynamic create template
	const snippet = new vscode.SnippetString();
	snippet.appendText(`${leadingWhitespace}if(`);
	snippet.appendPlaceholder(codeStart.replace('.ifA', '')); // 移除 .ifA
	snippet.appendText(`)`);
	snippet.appendText(`\n${leadingWhitespace}{\n`);
	snippet.appendText(`${leadingWhitespace}\t`);
	snippet.appendChoice(['// TODO: Add logic here', '// Placeholder']); // 提供選擇清單
	snippet.appendText(`\n${leadingWhitespace}}`);

	
	await editor.edit(editBuilder => {
		const range = new vscode.Range(position.line, 0, position.line, lineText.length);
		editBuilder.delete(range);
	});

	
	const snippetPosition = new vscode.Position(position.line, 0);
	editor.insertSnippet(snippet, snippetPosition);
});
