# Todo Highlighter

A fast, lightweight vscode extension that highlights 'todo' keyword and lists all todos in the side bar.

## Features

- Provides a `todo` snippet for multiple programming languages
- Highlights the word `TODO`
- Lists all todos, accessible via `Activity Bar`
- Runs in the browser (vscode.dev / github.dev)

## Performance

Built around a single feature, tuned to be invisible:

- ~5 KB install, zero runtime dependencies
- Activates after startup, so it never slows down editor boot
- Highlighting uses one native string scan per edit, no regex engines
- The todo list reads files in parallel without opening them as documents
- Big and Binary files are skipped automatically

## Preview

Snippet + Live List Update

![snippet preview](https://raw.githubusercontent.com/zerefdev/todo-highlighter/main/src/media/preview/snippet.gif)

Todo List + Easy Access

![list preview](https://raw.githubusercontent.com/zerefdev/todo-highlighter/main/src/media/preview/list.gif)

Include/Exclude Directories

![exclude preview](https://raw.githubusercontent.com/zerefdev/todo-highlighter/main/src/media/preview/exclude.gif)

Customizable Styling

![style preview](https://raw.githubusercontent.com/zerefdev/todo-highlighter/main/src/media/preview/style.gif)
