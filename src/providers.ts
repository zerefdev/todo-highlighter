import { EventEmitter, GlobPattern, ThemeIcon, TreeDataProvider, TreeItem, TreeItemCollapsibleState, Uri, workspace } from 'vscode';
import { COMMANDS, EXCLUDE, INCLUDE, MAX_RESULTS, REGEX, TODO } from './constants';

export class TodoTreeListProvider implements TreeDataProvider<Todo> {
  private _onDidChangeTreeData = new EventEmitter<Todo | undefined | null | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  getTreeItem(element: Todo): TreeItem {
    return element;
  }

  async getChildren(element?: Todo): Promise<Todo[]> {
    if (!element) {
      return Promise.resolve(await this.getTodoList());
    }

    return Promise.resolve(element.children ?? []);
  }

  private async getTodoList(): Promise<Todo[]> {
    const arr1: Todo[] = [];
    const files = await workspace.findFiles(
      pattern(INCLUDE),
      pattern(EXCLUDE),
      MAX_RESULTS
    );

    if (files.length) {
      for (let i = 0; i < files.length; i++) {
        const arr2: Todo[] = [];
        const file = files[i];
        const doc = await workspace.openTextDocument(file);
        const docUri = doc.uri;
        const fileName = doc.fileName
          .replace(/\\/g, '/')
          .split('/').pop()
          ?? 'unknown';

        for (let j = 0; j < doc.lineCount; j++) {
          const text = doc.lineAt(j).text;

          if (REGEX.test(text)) {
            const todoText = text.slice(text.indexOf(TODO) + TODO.length + 1, text.length);
            if (todoText) arr2.push(new Todo(todoText, undefined, docUri, j));
          }
        }

        if (arr2.length) arr1.push(new Todo(fileName, arr2, docUri));
      }
    }

    return Promise.resolve(arr1);
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}

class Todo extends TreeItem {
  children: Todo[] | undefined;

  constructor(label: string, children?: Todo[], path?: Uri, col?: number) {
    super(label, children ? TreeItemCollapsibleState.Expanded : TreeItemCollapsibleState.None);
    this.children = children;
    this.iconPath = children ? new ThemeIcon('file') : undefined;
    this.resourceUri = children ? path : undefined;
    this.description = true;
    this.command = !children ? {
      command: COMMANDS.OPEN_FILE,
      title: 'Open file',
      arguments: [path, col]
    } : undefined;
  }
}


function pattern(glob: string[]): GlobPattern {
  return '{' + glob.join(',') + '}';
}
