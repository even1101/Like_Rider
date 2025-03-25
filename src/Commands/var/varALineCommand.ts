import * as vscode from 'vscode';
import { isCSharpKeyword, isCSharpType } from '../../utils/csharpUtils'; // Import utility functions for C# checks

export const generateVarALineSnippetCommand = vscode.commands.registerCommand('extension.generateVarALineSnippet', async () => {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {return;}

	const document = editor.document;
	const selection = editor.selection;
	const position = selection.active;

	const line = document.lineAt(position.line);
	let lineText = line.text;

	// Remove `.vara` if it exists
	if (lineText.includes('.varA')) {
		const varIndex = lineText.indexOf('.varA');
		const range = new vscode.Range(
			new vscode.Position(line.lineNumber, varIndex),
			new vscode.Position(line.lineNumber, varIndex + 5)
		);
		await editor.edit(editBuilder => editBuilder.delete(range));
		 // Update the line text after deletion
		lineText = document.lineAt(position.line).text;
	}

	await processLine(lineText, line, editor, position);
});

async function processLine(lineText: string, line: vscode.TextLine, editor: vscode.TextEditor, position: vscode.Position) {
	// Find the first non-whitespace or non-tab character in the current line
	const firstNonWhitespaceIndex = lineText.search(/\S/);

	// Check if the first word is a C# keyword or type
	if (firstNonWhitespaceIndex !== -1) {
		const firstWord = lineText.slice(firstNonWhitespaceIndex).split(/\s+/)[0];
		if (isCSharpKeyword(firstWord) || isCSharpType(firstWord)) {
			return; // Do nothing if it's a keyword or type
		}
	}

	await editor.edit(editBuilder => {
		if (firstNonWhitespaceIndex === -1 || firstNonWhitespaceIndex > position.character) {
			// If the line is empty or the cursor is in the whitespace area, insert at the beginning of the line
			editBuilder.insert(line.range.start, 'var myVar = ');
		} else {
			// Insert before the first non-whitespace character
			const insertPosition = new vscode.Position(line.lineNumber, firstNonWhitespaceIndex);
			editBuilder.insert(insertPosition, 'var myVar = ');
		}
	});

	// Select `myVar` and configure Tab behavior to jump to a new line
	const newLineText = editor.document.lineAt(position.line).text;
	const myVarIndex = newLineText.indexOf('myVar');
	if (myVarIndex !== -1) {
		const start = new vscode.Position(position.line, myVarIndex);
		const end = new vscode.Position(position.line, myVarIndex + 'myVar'.length);
		editor.selection = new vscode.Selection(start, end);

	}
}