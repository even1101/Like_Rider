import * as vscode from 'vscode';
// back to start
// import { initializeVarRule } from './rules/var/varRule';
// import { initializeReturnRule } from './rules/return/returnRule';
// import { initializeAwaitRule } from './rules/await/awaitRule';
// import { initializeIfRule } from './rules/if/ifRule';
// import { initializeTaskRule } from './rules/task/taskRule';
// import { initializeAsyncRule } from './rules/async/asyncRule';
// current line 1 postion to end
import { initializeVarALineRule } from './rules/var/varALineRule';
import { initializeReturnALineRule } from './rules/return/returnALineRule';
// import { initializeAwaitALineRule } from './rules/await/awaitALineRule';
import { initializeIfALineRule } from './rules/if/ifALineRule';
// import { initializeTaskALineRule } from './rules/task/taskALineRule';
// import { initializeAsyncALineRule } from './rules/async/asyncALineRule';
// Quick Tools
import { registerNGUID } from './features/nguid';
import { registerNDate } from './features/ndate';

export function activate(context: vscode.ExtensionContext) {
	
	vscode.workspace.textDocuments.forEach((document) => {
		if (document.languageId !== 'csharp') {
			return;
		}

		// Not yet implemented command
		// initializeVarRule(context);
		// initializeReturnRule(context);
		// initializeAwaitRule(context);
		// initializeIfRule(context);
		// initializeAsyncRule(context);
		// initializeTaskRule(context);

		initializeVarALineRule(context);
		initializeReturnALineRule(context);
		// initializeAwaitALineRule(context);
		initializeIfALineRule(context);
		// initializeAsyncALineRule(context);
		// initializeTaskALineRule(context);

		vscode.window.showInformationMessage('Like Rider Initialize success');
	});

	vscode.workspace.onDidChangeTextDocument(async (event) => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) { return; }

		const document = editor.document;
		const text = document.getText();

		await registerNGUID(text, editor);
		await registerNDate(text, editor);
		
	});

}

export function deactivate() {}
