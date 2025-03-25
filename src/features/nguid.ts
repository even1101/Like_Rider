import * as vscode from 'vscode';
import { v4 as uuidv4 } from 'uuid';

export async function registerNGUID(text: string, editor: vscode.TextEditor): Promise<void> {
	if (!text.includes('@nguid')) { return; }
        
    const document = editor.document;
	const position = editor.selection.active;

	const selection = await vscode.window.showQuickPick(
		[
			{ label: 'new guid Include -', description: 'Generate a new GUID with dashes' },
			{ label: 'new guid skip -', description: 'Generate a new GUID without dashes' }
		],
		{ placeHolder: 'Select GUID format' }
	);

	if (!selection) {
		return;
	}

	// Delete @nguid keyword
	const range = document.getWordRangeAtPosition(position, /@nguid/);
	if (range) {
		await editor.edit((editBuilder) => {
			editBuilder.delete(range);
		});
	}

	// Generate corresponding GUID based on selection
	const guid = selection.label.includes('skip') ? uuidv4().replace(/-/g, '') : uuidv4();
	await editor.edit((editBuilder) => {
		editBuilder.insert(position, guid);
	});
}
