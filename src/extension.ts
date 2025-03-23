import * as vscode from 'vscode';

import { initializeVarRule } from './rules/varRule';
import { initializeReturnRule } from './rules/returnRule';
import { initializeAwaitRule } from './rules/awaitRule';
import { initializeIfRule } from './rules/ifRule';

export function activate(context: vscode.ExtensionContext) {
	
	vscode.workspace.textDocuments.forEach((document) => {

		if (document.languageId !== 'csharp') {
			return;
		}

		// init rule
		initializeVarRule(context);
		initializeReturnRule(context);
		initializeAwaitRule(context);
		initializeIfRule(context);

		vscode.window.showInformationMessage('Like Rider Initialize success');
	});

}

export function deactivate() {}
