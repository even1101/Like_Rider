import * as vscode from 'vscode';

export const generateReturnALineSnippetCommand = vscode.commands.registerCommand('extension.generateReturnALineSnippet', async () => {
	const editor = vscode.window.activeTextEditor;
	if (!editor) { return; }

	const document = editor.document;
	const selection = editor.selection;
	const position = selection.active;

	const line = document.lineAt(position.line);
	let lineText = line.text;

	// Remove `.returnA` if it exists
	if (lineText.includes('.returnA')) {
		const returnAIndex = lineText.indexOf('.returnA');
		const range = new vscode.Range(
			new vscode.Position(line.lineNumber, returnAIndex),
			new vscode.Position(line.lineNumber, returnAIndex + 8)
		);
		await editor.edit(editBuilder => editBuilder.delete(range));
		// Update the line text after deletion
		lineText = document.lineAt(position.line).text;
	}

	await processReturnLine(lineText, line, editor, position);
});

async function processReturnLine(lineText: string, line: vscode.TextLine, editor: vscode.TextEditor, position: vscode.Position) {
	// Find the first non-whitespace or non-tab character in the current line
	const firstNonWhitespaceIndex = lineText.search(/\S/);

	await editor.edit(editBuilder => {
		if (firstNonWhitespaceIndex === -1 || firstNonWhitespaceIndex > position.character) {
			// If the line is empty or the cursor is in the whitespace area, insert at the beginning of the line
			editBuilder.insert(line.range.start, 'return ');
		} else {
			// Insert before the first non-whitespace character
			const insertPosition = new vscode.Position(line.lineNumber, firstNonWhitespaceIndex);
			editBuilder.insert(insertPosition, 'return ');
		}
	});
}
