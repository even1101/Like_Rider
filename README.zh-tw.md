# Like Rider

[![en](https://img.shields.io/badge/lang-en-red.svg)](README.md)  
[![zh-tw](https://img.shields.io/badge/lang-zh--tw-blue.svg)](README.zh-tw.md)

Like Rider 是一個專為 C# 開發者設計的 Visual Studio Code 擴展，提供智能自動補全功能，幫助您更快速地撰寫程式碼。

## 功能

### 已實作功能

- **智能補全**
  - `.ifA`：生成單行 `if` 條件語句。
  - `.varA`：生成單行變數聲明。
  - `.returnA`：生成單行 `return` 語句。
  - `.var`：生成變數聲明。
  - `.return`：生成多行 `return` 語句。 
- **快捷工具**
  - `@newC#`：[新功能] 快速產生C# 樣板。
  - `@nguid`：生成 GUID（可選擇是否包含連字符）。
  - `@ndate`：生成日期或時間戳（多種格式可選）。
  

### 尚未實作功能

- `.await`：預期生成非同步 `await` 語句。
- `.if`：預期生成多行 `if` 條件語句區塊。
- `.task`：預期生成 Task 方法。
- `.async`：預期生成 Async 方法。
- `.awaitA`：預期生成單行 `await` 語句。
- `.taskA`：預期生成單行 Task 方法。
- `.asyncA`：預期生成單行 Async 方法。


## 安裝

1. 確保您已安裝 [Visual Studio Code](https://code.visualstudio.com/)。
2. 在 VS Code 中打開擴展市場，搜尋並安裝 **Like Rider**。
3. 開始使用！

## 使用方式

### 自動補全

1. 在 C# 檔案中輸入以下關鍵字觸發補全：
   - `.var`、`.await`、`.if`、`.return`、`.varA`、`.ifA`、`.returnA`。

2. 範例(都是在程式碼結尾輸入)：
   - 輸入 `new List<int> {1,2,3}.varA` 會建議補全 `var myVar = new List<int> {1,2,3}`。
   - 輸入 `.ifA` 會建議補全單行 `if` 條件語句。

### 快捷工具

1. 使用 `@newC#` 關鍵字可以快速建立C#樣板 或是 使用F1 or ctrl + p 輸入 Like Rider New Template

2. 使用 `@nguid` 關鍵字生成 GUID：
   - 範例：`@nguid` → 選擇格式 → `123e4567-e89b-12d3-a456-426614174000`。

3. 使用 `@ndate` 關鍵字生成日期或時間戳：
   - 範例：`@ndate` → 選擇格式 → `2023-12-31`。
   
## 開發與貢獻

歡迎對本專案進行貢獻！請遵循以下步驟：

1. Fork 本專案。
2. Clone 到本地並安裝依賴：
   ```bash
   npm install
   ```
3. 啟動開發模式：
   ```bash
   npm run watch
   ```
4. 提交 Pull Request。

- 如果您發現任何問題，請提交 Issue。

