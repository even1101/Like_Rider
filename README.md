# Like Rider

[![en](https://img.shields.io/badge/lang-en-red.svg)](README.md)  
[![zh-tw](https://img.shields.io/badge/lang-zh--tw-blue.svg)](README.zh-tw.md)

Like Rider is a Visual Studio Code extension designed for C# developers, providing intelligent auto-completion and quick tools to help you write code faster.

## Features

### Implemented Features

- **Intelligent Auto-Completion**
  - `.ifA`: Generates a single-line `if` conditional block.
  - `.varA`: Generates a single-line variable declaration.
  - `.returnA`: Generates a single-line `return` statement.
  - `.var`: Generate a variable declaration.
  - `.return`: Generate a multi-line `return` statement.
- **Quick Tools**
  - `@newC#`: [Feature] Quickly generate C# code templates.
  - `@nguid`: Generates a GUID (with or without dashes).
  - `@ndate`: Generates a date or timestamp in various formats.

### Unimplemented Features

- `.await`: Intended to generate an asynchronous `await` statement.
- `.if`: Intended to generate a multi-line `if` conditional block.
- `.task`: Intended to generate a Task method.
- `.async`: Intended to generate an Async method.
- `.awaitA`: Intended to generate a single-line `await` statement.
- `.taskA`: Intended to generate a single-line Task method.
- `.asyncA`: Intended to generate a single-line Async method.



## Usage

### Autocomplete

1. In a C# file, type any of the following keywords at the end of an expression to trigger autocomplete:
.var, .await, .if, .return, .varA, .ifA, .returnA

2. Examples (triggered at the end of a code line):

  - Typing new List<int> {1,2,3}.varA will suggest var myVar = new List<int> {1,2,3}.

  - Typing .ifA will suggest a single-line if statement.

### Quick Tools

1. Use the keyword @newC# to quickly create a C# code template, or use F1 or Ctrl + P and type "Like Rider New Template".

2. Use @nguid to generate a GUID:
  - Example: @nguid → choose format → 123e4567-e89b-12d3-a456-426614174000

3. Use @ndate to generate a date or timestamp:
  - Example: @ndate → choose format → 2023-12-31
