import * as vscode from 'vscode';
import { createNewFile } from '../utils/fileUtils';

export async function registerNewFile(text: string, editor: vscode.TextEditor): Promise<void> {
    if (!text.includes('@newC#')) { return; }

    const document = editor.document;

    editor.edit(editBuilder => {
        const fullRange = new vscode.Range(
            document.positionAt(text.indexOf('@newC#')),
            document.positionAt(text.indexOf('@newC#') + '@newC#'.length)
        );
        editBuilder.delete(fullRange);
    });

    await createNewFile();
}

export { createNewFile };




