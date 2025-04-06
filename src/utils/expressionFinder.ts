import * as vscode from 'vscode';
import { trimRangeWhitespace } from './textUtils';

/**
 * 代碼狀態跟踪器類，用於記錄解析代碼時的各種狀態
 */
class CodeStateTracker {
  // 括號平衡計數
  balance = { '(': 0, '[': 0, '{': 0, '<': 0 };
  
  // 字符串和註釋狀態
  inBlockComment = false;
  inString = false;
  stringChar: '"' | "'" | undefined = undefined;
  
  /**
   * 檢查所有括號是否平衡（或者有多餘的關閉括號）
   */
  areBracketsBalanced(): boolean {
    return this.balance['('] <= 0 && 
           this.balance['['] <= 0 && 
           this.balance['{'] <= 0 && 
           this.balance['<'] <= 0;
  }
  
  /**
   * 重置所有負平衡計數
   */
  resetNegativeBalances(): void {
    Object.keys(this.balance).forEach(key => {
      if (this.balance[key as keyof typeof this.balance] < 0) {
        this.balance[key as keyof typeof this.balance] = 0;
      }
    });
  }
  
  /**
   * 處理開閉括號的平衡計數
   */
  handleBracket(char: string): void {
    if (char === ')') this.balance['(']++;
    else if (char === ']') this.balance['[']++;
    else if (char === '}') this.balance['{']++;
    else if (char === '>') this.balance['<']++;
    else if (char === '(') this.balance['(']--;
    else if (char === '[') this.balance['[']--;
    else if (char === '{') this.balance['{']--;
    else if (char === '<') this.balance['<']--;
  }
  
  /**
   * 重置行間狀態（於換行時調用）
   */
  resetLineState(): void {
    this.inString = false;
    this.stringChar = undefined;
    // 注意：不重置塊註釋和括號平衡狀態，它們可以跨越多行
  }
}

/**
 * 檢查當前字符是否在註釋或字符串中
 * @returns 如果處理了字符，返回true；否則返回false
 */
function handleCommentAndString(
  state: CodeStateTracker,
  char: string,
  prevChar: string | null
): boolean {
  // 處理塊註釋
  if (state.inBlockComment) {
    if (char === '*' && prevChar === '/') {
      state.inBlockComment = false;
    }
    return true; // 在塊註釋中，跳過其他檢查
  }
  
  // 塊註釋開始
  if (char === '/' && prevChar === '*') {
    state.inBlockComment = true;
    return true;
  }
  
  // 行註釋
  if (char === '/' && prevChar === '/') {
    return true; // 行註釋，後續字符都應該被忽略
  }
  
  // 字符串處理
  if (state.inString) {
    if (char === state.stringChar && prevChar !== '\\') {
      state.inString = false;
      state.stringChar = undefined;
    }
    return true; // 在字符串中，跳過其他檢查
  }
  
  // 字符串開始
  if ((char === '"' || char === "'") && prevChar !== '\\' && !state.inBlockComment) {
    state.inString = true;
    state.stringChar = char;
    return true;
  }
  
  return false; // 未處理任何特殊情況
}

/**
 * 檢查行的開頭是否包含導致表達式開始的關鍵字
 */
function checkForStartingKeywords(lineText: string, charIndex: number): boolean {
  const lineStartText = lineText.substring(charIndex);
  const startingKeywords = [
    'return ', 'yield ', 'throw ', 
    'if ', 'for ', 'while ', 'foreach ', 
    'using ', 'switch ', 'lock ', 'await '
  ];
  
  return startingKeywords.some(kw => lineStartText.startsWith(kw));
}

/**
 * 檢查上一行是否以可能的續行符號結束
 */
function isPreviousLineContinuation(trimmedPrevLineText: string): boolean {
  // 匹配不以常見運算符或開括號結尾，也不是以註釋開始的行
  const likelyContinuationEnd = /[.\-+*/%&|^=<>\!?:(,[(]\s*$/;
  const likelyCommentStart = /\/\/\s*$|\/\*\s*$/;
  
  return likelyContinuationEnd.test(trimmedPrevLineText) || 
         likelyCommentStart.test(trimmedPrevLineText) || 
         trimmedPrevLineText.length === 0;
}

/**
 * 尋找從triggerStartPosition向前的可能多行C#表達式範圍
 * @param document 文本文檔
 * @param triggerStartPosition 觸發字符（例如'.'）之前的位置
 * @returns 表達式範圍，如果無法確定則返回undefined
 */
export function findExpressionRange(
  document: vscode.TextDocument, 
  triggerStartPosition: vscode.Position
): vscode.Range | undefined {
  console.log(`[findExpressionRange] 從行: ${triggerStartPosition.line}, 字元: ${triggerStartPosition.character} 開始向後搜索`);

  let currentLineNum = triggerStartPosition.line;
  let expressionStartPos: vscode.Position | undefined = undefined;

  // 創建狀態跟踪器
  const state = new CodeStateTracker();

  outerLoop:
  while (currentLineNum >= 0) {
    const line = document.lineAt(currentLineNum);
    const lineText = line.text;
    const firstNonWhitespaceIndex = line.firstNonWhitespaceCharacterIndex;

    // 確定在本行搜索的結束字符索引
    const searchEndCharIndex = (currentLineNum === triggerStartPosition.line) 
      ? triggerStartPosition.character 
      : lineText.length;

    // 檢查當前行是否以'.'開頭，表示鏈式調用
    const isChainedCall = lineText.substring(firstNonWhitespaceIndex).startsWith('.');
    console.log(`[findExpressionRange] 行 ${currentLineNum}: "${lineText.substring(0,40)}..." isChainedCall: ${isChainedCall}`);

    // 在當前行向後搜索
    for (let charIndex = searchEndCharIndex - 1; charIndex >= 0; charIndex--) {
      const char = lineText[charIndex];
      const prevChar = charIndex > 0 ? lineText[charIndex - 1] : null;

      // 處理註釋和字符串
      if (handleCommentAndString(state, char, prevChar)) {
        if (char === '/' && prevChar === '/') break; // 行註釋開始，結束本行掃描
        continue;
      }

      // 處理括號平衡
      state.handleBracket(char);

      // 檢查語句終止符或表達式開始指示符
      // 只有在括號/方括號/大括號平衡（或起始）時才檢查
      if (state.areBracketsBalanced()) {
        // 重置負平衡（可能發生在觸發器之前的不平衡代碼中）
        state.resetNegativeBalances();

        // 找到前一個語句的結尾';'
        if (char === ';') {
          expressionStartPos = new vscode.Position(currentLineNum, charIndex + 1);
          console.log(`[findExpressionRange] 在 ${currentLineNum}:${charIndex} 處的';'處中斷。起始設置為 ${expressionStartPos.line}:${expressionStartPos.character}`);
          break outerLoop;
        }

        // 檢查行開頭的關鍵字
        if (charIndex === firstNonWhitespaceIndex) {
          if (checkForStartingKeywords(lineText, charIndex)) {
            expressionStartPos = new vscode.Position(currentLineNum, charIndex);
            console.log(`[findExpressionRange] 在行開頭 ${currentLineNum}:${charIndex} 的關鍵字處中斷。`);
            break outerLoop;
          }
        }
      }
    } // 結束字符循環

    // 行掃描結束
    // 決定是否需要繼續到上一行

    if (currentLineNum === 0) {
      // 達到文件開頭
      expressionStartPos = new vscode.Position(0, firstNonWhitespaceIndex);
      console.log(`[findExpressionRange] 中斷因為達到文件開頭。起始設置為 ${expressionStartPos.line}:${expressionStartPos.character}`);
      break outerLoop;
    }

    // 決定是否向上移動
    const prevLine = document.lineAt(currentLineNum - 1);
    const trimmedPrevLineText = prevLine.text.trimEnd();

    // 條件1：如果上一行以';'結尾，表達式必須從當前行開始
    if (trimmedPrevLineText.endsWith(';')) {
      expressionStartPos = new vscode.Position(currentLineNum, firstNonWhitespaceIndex);
      console.log(`[findExpressionRange] 中斷因為上一行以';'結尾。起始設置為當前行 ${currentLineNum}:${expressionStartPos.character}`);
      break outerLoop;
    }

    // 條件2：如果當前行不是鏈式調用（不以'.'開頭）
    // 並且上一行看起來不像是繼續表達式，
    // 那麼表達式可能從當前行開始
    if (!isChainedCall) {
      if (!isPreviousLineContinuation(trimmedPrevLineText)) {
        expressionStartPos = new vscode.Position(currentLineNum, firstNonWhitespaceIndex);
        console.log(`[findExpressionRange] 中斷因為當前行不是鏈式調用且上一行不以可能的繼續字符結尾。起始設置為當前行 ${currentLineNum}:${expressionStartPos.character}`);
        break outerLoop;
      }
    }

    // 如果沒有滿足中斷條件，繼續到上一行
    console.log(`[findExpressionRange] 繼續到上一行 (${currentLineNum - 1})`);
    currentLineNum--;
    
    // 為新行重置狀態
    state.resetLineState();

  } // 結束外層循環（向上尋找行）

  // 最終範圍計算和驗證
  if (expressionStartPos) {
    // 確保起始不在結束之後
    if (expressionStartPos.isAfter(triggerStartPosition)) {
      console.warn("[findExpressionRange] 計算的表達式起始在觸發起始之後。範圍無效。");
      vscode.window.showErrorMessage("無法確定表達式範圍（起始在結束之後）。");
      return undefined;
    }
    
    const rawRange = new vscode.Range(expressionStartPos, triggerStartPosition);
    console.log(`[findExpressionRange] 找到原始範圍: [${rawRange.start.line}, ${rawRange.start.character}] 到 [${rawRange.end.line}, ${rawRange.end.character}]`);

    // 使用提供的剪裁函數
    const trimmedRange = trimRangeWhitespace(document, rawRange);
    console.log(`[findExpressionRange] 剪裁後範圍: [${trimmedRange.start.line}, ${trimmedRange.start.character}] 到 [${trimmedRange.end.line}, ${trimmedRange.end.character}]`);

    const text = document.getText(trimmedRange);
    console.log(`[findExpressionRange] 最終文本: "${text}"`);

    if (!text.trim()) {
      console.warn("[findExpressionRange] 找到的範圍只包含空白或為空。");
      vscode.window.showErrorMessage("在'.'觸發前無法找到有效表達式。");
      return undefined;
    }

    return trimmedRange;
  }

  console.warn("[findExpressionRange] 無法可靠地找到表達式開始。");
  vscode.window.showErrorMessage("無法自動確定'.'觸發前的表達式。");
  return undefined;
}