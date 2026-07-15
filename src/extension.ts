import {
  commands,
  ExtensionContext,
  Position,
  Range,
  Selection,
  TextEditor,
  TextEditorDecorationType,
  TextEditorRevealType,
  Uri,
  window,
  workspace
} from 'vscode';
import { COMMANDS, EXTENSION_ID, TODO, VIEWS } from './constants';
import { Decoration } from './decoration';
import { TodoTreeListProvider } from './providers';

export function activate(ctx: ExtensionContext) {
  const todoTreeList = new TodoTreeListProvider();
  const todoView = window.createTreeView(VIEWS.TODO_LIST, {
    treeDataProvider: todoTreeList,
    showCollapseAll: true
  });

  Decoration.config(workspace.getConfiguration(EXTENSION_ID));
  let decorationType = window.createTextEditorDecorationType(Decoration.decoration());
  window.visibleTextEditors.forEach((editor) => styleText(editor, decorationType));

  todoTreeList.onDidCountTodos(
    (count) => {
      todoView.badge = count
        ? { value: count, tooltip: `${count} todo${count === 1 ? '' : 's'}` }
        : undefined;
    },
    null,
    ctx.subscriptions
  );

  ctx.subscriptions.push(
    todoView,
    { dispose: () => decorationType.dispose() },
    commands.registerCommand(COMMANDS.REFRESH, () => {
      todoTreeList.refresh();
    })
  );

  ctx.subscriptions.push(
    commands.registerCommand(COMMANDS.OPEN_FILE, (uri: Uri, col: number) => {
      window.showTextDocument(uri).then((editor: TextEditor) => {
        const pos = new Position(col, 0);
        editor.revealRange(new Range(pos, pos), TextEditorRevealType.InCenterIfOutsideViewport);
        editor.selection = new Selection(pos, pos);
      });
    })
  );

  window.onDidChangeActiveTextEditor(
    (e) => {
      styleText(e, decorationType);
    },
    null,
    ctx.subscriptions
  );

  workspace.onDidChangeTextDocument(
    (e) => {
      const editor = window.activeTextEditor;
      if (editor && e.document === editor.document) styleText(editor, decorationType);
    },
    null,
    ctx.subscriptions
  );

  workspace.onDidSaveTextDocument(
    () => {
      todoTreeList.refresh();
    },
    null,
    ctx.subscriptions
  );

  workspace.onDidChangeConfiguration(
    (e) => {
      if (!e.affectsConfiguration(EXTENSION_ID)) return;

      Decoration.config(workspace.getConfiguration(EXTENSION_ID));
      decorationType.dispose();
      decorationType = window.createTextEditorDecorationType(Decoration.decoration());
      window.visibleTextEditors.forEach((editor) => styleText(editor, decorationType));
      todoTreeList.refresh();
    },
    null,
    ctx.subscriptions
  );
}

function styleText(editor: TextEditor | undefined, decorationType: TextEditorDecorationType) {
  if (!editor) return;
  const doc = editor.document;
  const str = doc.getText();
  const ranges: Range[] = [];
  let index = str.indexOf(TODO);

  while (index !== -1) {
    ranges.push(new Range(doc.positionAt(index), doc.positionAt(index + TODO.length)));
    index = str.indexOf(TODO, index + TODO.length);
  }

  editor.setDecorations(decorationType, ranges);
}
