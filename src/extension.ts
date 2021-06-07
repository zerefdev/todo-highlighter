import {
    commands,
    ExtensionContext,
    Position,
    Range,
    Selection,
    TextEditor,
    TextEditorRevealType,
    Uri,
    window,
    workspace
} from 'vscode';
import { COMMANDS, EXTENSION_ID, REGEX, VIEWS } from './constants';
import { Decoration } from './decoration';
import { TodoTreeListProvider } from './providers';

export function activate(ctx: ExtensionContext) {
    const todoTreeList = new TodoTreeListProvider();
    let editor = window.activeTextEditor;

    window.registerTreeDataProvider(VIEWS.TODO_LIST, todoTreeList);
    Decoration.config(workspace.getConfiguration(EXTENSION_ID));
    styleText(editor);

    ctx.subscriptions.push(
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

    window.onDidChangeActiveTextEditor((e) => {
        if (e) {
            editor = e;
            styleText(e);
        }
    });

    workspace.onDidChangeTextDocument(() => {
        styleText(editor);
    });

    workspace.onDidSaveTextDocument(() => {
        todoTreeList.refresh();
    });

    workspace.onDidChangeConfiguration(async () => {
        Decoration.config(workspace.getConfiguration(EXTENSION_ID));
        styleText(editor);
        todoTreeList.refresh();
    });
}

function styleText(editor: TextEditor | undefined) {
    if (!editor) return;
    const doc = editor.document;
    const str = doc.getText();
    let match;

    while ((match = REGEX.exec(str))) {
        editor.setDecorations(window.createTextEditorDecorationType(Decoration.decoration()), [
            new Range(doc.positionAt(match.index), doc.positionAt(match.index + match[0].length))
        ]);
    }
}
