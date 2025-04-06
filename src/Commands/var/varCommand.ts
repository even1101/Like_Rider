import * as vscode from 'vscode';
import { VarSnipeetHandler } from "../../handler/VarSnipeetHandler";

export const generateVarSnippetCommand = vscode.commands.registerCommand(
  'extension.generateVarSnippet',
  async (document: vscode.TextDocument, position: vscode.Position) => {
    const handler = new VarSnipeetHandler(document, position);
    await handler.TriggerAsync();
});