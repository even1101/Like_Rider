import * as vscode from 'vscode';



/**
 * (簡易版本) 在當前游標所在行查找指定字串的 *第一次* 出現，將其移除，
 * 並回傳該字串被移除前的起始位置。
 * 使用 includes() 檢查存在，使用 indexOf() 定位。
 *
 * @param targetString 要查找並移除的字串 (例如 ".var", ".return")。
 * @returns A Promise，成功時解析為 vscode.Position (字串的原始起始位置)，
 * 如果找不到字串、沒有活動編輯器或編輯操作失敗，則解析為 undefined。
 */
export const removeFirstOccurrenceOnCurrentLineAsync = async (
  targetString: string
): Promise<vscode.Position | undefined> => {
  // 1. 獲取編輯器
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
      console.warn('[removeFirstOccurrence] No active text editor.');
      return undefined;
  }

  // 檢查輸入
  if (!targetString) {
      console.warn('[removeFirstOccurrence] Target string is empty.');
      return undefined;
  }

  const document = editor.document;
  const currentLineNumber = editor.selection.active.line;
  const currentLine = document.lineAt(currentLineNumber);
  const lineText = currentLine.text;

  // 2. 檢查字串是否存在 (使用 includes)
  if (!lineText.includes(targetString)) {
      console.log(`[removeFirstOccurrence] Target "${targetString}" not found on line ${currentLineNumber + 1}.`);
      return undefined;
  }

  // 3. 獲取第一個匹配項的索引 (使用 indexOf)
  const foundIndex = lineText.indexOf(targetString);

  // 雖然 includes() 檢查通過了，但為保險起見再次確認 indexOf 的結果
  if (foundIndex === -1) {
       console.warn(`[removeFirstOccurrence] "${targetString}" passed includes() but indexOf() returned -1. Unexpected.`);
       return undefined;
  }

  // 4. 計算範圍
  const startPosition = new vscode.Position(currentLineNumber, foundIndex);
  const endPosition = new vscode.Position(currentLineNumber, foundIndex + targetString.length);
  const rangeToRemove = new vscode.Range(startPosition, endPosition);

  console.log(`[removeFirstOccurrence] Found first "${targetString}" at Line: ${startPosition.line + 1}, Char: ${startPosition.character}. Removing...`);

  // 5. 執行刪除
  try {
      const success = await editor.edit(editBuilder => {
          editBuilder.delete(rangeToRemove);
      });

      if (success) {
          console.log(`[removeFirstOccurrence] Removed first "${targetString}" successfully.`);
          // 6. 回傳原始起始位置
          return startPosition;
      } else {
          console.error(`[removeFirstOccurrence] Edit operation failed for "${targetString}".`);
          vscode.window.showErrorMessage(`移除 "${targetString}" 失敗。`);
          return undefined;
      }
  } catch (error) {
      console.error(`[removeFirstOccurrence] Error removing "${targetString}":`, error);
      vscode.window.showErrorMessage(`移除 "${targetString}" 時發生錯誤。`);
      return undefined;
  }
}



export const removeTriggerKeyWord = async (document: vscode.TextDocument, position: vscode.Position, editor: vscode.TextEditor, triggerKeyWord: string): Promise<string> => {
  
  const line = document.lineAt(position.line);
  let lineText = line.text;
  
  if (lineText.includes(triggerKeyWord)) {
    const varIndex = lineText.indexOf(triggerKeyWord);
        
    const range = new vscode.Range(
      new vscode.Position(line.lineNumber, varIndex),
      new vscode.Position(line.lineNumber, varIndex + triggerKeyWord.length - 1)
    );
    await editor.edit(editBuilder => editBuilder.delete(range));
    lineText = document.lineAt(position.line).text;
  }
  return lineText;
};

/**
 * 輔助函數：調整範圍以排除其文本內容中的前導/尾隨空白。
 * @param document 文本文檔
 * @param range 要調整的範圍
 * @returns 調整後的範圍，不包含前導和尾隨空白
 */
export const trimRangeWhitespace = (document: vscode.TextDocument, range: vscode.Range): vscode.Range => {
  const text = document.getText(range);
  if (!text) { return range; } // 處理空範圍

  const leadingWhitespaceMatch = text.match(/^\s*/);
  const trailingWhitespaceMatch = text.match(/\s*$/);

  const startOffset = leadingWhitespaceMatch ? leadingWhitespaceMatch[0].length : 0;
  // 重要：根據修剪尾隨空格之前的*原始*文本長度計算結束偏移量
  const endOffset = trailingWhitespaceMatch ? text.length - trailingWhitespaceMatch[0].length : text.length;

  if (startOffset >= endOffset) { // 如果範圍在修剪後變為空
    const originalStartOffset = document.offsetAt(range.start);
    const newPos = document.positionAt(originalStartOffset + startOffset);
    return new vscode.Range(newPos, newPos); // 返回在開始修剪位置折疊的範圍
  }

  const newStart = document.positionAt(document.offsetAt(range.start) + startOffset);
  // 根據起始位置 + 修剪後內容的長度計算新的結束位置
  const newEnd = document.positionAt(document.offsetAt(range.start) + endOffset);

  return new vscode.Range(newStart, newEnd);
};

/**
 * 檢查字符串是否只包含空白字符
 * @param text 要檢查的文本
 * @returns 如果文本僅包含空白字符則返回true
 */
export const isWhitespaceOnly = (text: string): boolean => {
  return /^\s*$/.test(text);
};

/**
 * 獲取文本單行表示，移除所有換行
 * @param text 要處理的文本
 * @param maxLength 可選的最大長度限制
 * @returns 單行文本
 */
export const getSingleLineRepresentation = (text: string, maxLength: number = 40): string => {
  const singleLine = text.replace(/\r?\n/g, '\\n');
  if (singleLine.length <= maxLength) {
    return singleLine;
  }
  return singleLine.substring(0, maxLength - 3) + '...';
};