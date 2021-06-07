import {
    commands,
    DecorationRangeBehavior,
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
import { COMMANDS, EXTENSION_ID, VIEWS } from './constants';
import { Decoration } from './decoration';
import { TodoTreeListProvider } from './providers';

export let keywords: string[];

export function activate(ctx: ExtensionContext) {
    const todoTreeList = new TodoTreeListProvider();
    let editor = window.activeTextEditor;

    window.registerTreeDataProvider(VIEWS.TODO_LIST, todoTreeList);
    Decoration.init(workspace.getConfiguration(EXTENSION_ID));
    keywords = Decoration.getKeywords();
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
        Decoration.init(workspace.getConfiguration(EXTENSION_ID));
        keywords = Decoration.getKeywords();
        styleText(editor);
        todoTreeList.refresh();
    });
}

function styleText(editor: TextEditor | undefined) {
    if (!editor || !keywords) return;
    const doc = editor.document;
    const str = doc.getText();
    const regex = new RegExp(keywords.join('|'), 'g');
    let match;

    while ((match = regex.exec(str))) {
        const keyword = match[0];

        editor.setDecorations(
            window.createTextEditorDecorationType({
                ...Decoration.decoration(keyword),
                rangeBehavior: DecorationRangeBehavior.ClosedClosed
            }),
            [new Range(doc.positionAt(match.index), doc.positionAt(match.index + keyword.length))]
        );
    }
}
