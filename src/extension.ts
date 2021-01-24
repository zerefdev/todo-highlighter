import { ExtensionContext, Range, TextEditor, window, workspace } from 'vscode';
import { Decoration } from './config';

export function activate(ctx: ExtensionContext) {
  let editor = window.activeTextEditor!;

  styleText(editor);

  window.onDidChangeActiveTextEditor((e) => {
    if (e) {
      editor = e;
      styleText(e);
    }
  });

  workspace.onDidChangeTextDocument(() => {
    styleText(editor);
  });
}

function styleText(editor: TextEditor) {
  const doc = editor.document;
  const str = doc.getText();
  const regex = /todo:/ig;
  let match;

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec#finding_successive_matches
  while ((match = regex.exec(str)) !== null) {
    editor.setDecorations(
      window.createTextEditorDecorationType(Decoration.decorations()),
      [new Range(doc.positionAt(match.index), doc.positionAt(match.index + 5))]
    );
  }
}
