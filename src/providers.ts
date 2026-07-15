import {
  EventEmitter,
  GlobPattern,
  ThemeIcon,
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
  Uri,
  workspace
} from 'vscode';
import { COMMANDS, MAX_FILE_SIZE, TODO } from './constants';
import { Decoration } from './decoration';

export class TodoTreeListProvider implements TreeDataProvider<Todo> {
  private _onDidChangeTreeData = new EventEmitter<Todo | undefined | null | void>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
  private _onDidCountTodos = new EventEmitter<number>();
  readonly onDidCountTodos = this._onDidCountTodos.event;

  getTreeItem(element: Todo): TreeItem {
    return element;
  }

  async getChildren(element?: Todo): Promise<Todo[]> {
    if (!element) return this.getTodoList();

    return element.children ?? [];
  }

  private async getTodoList(): Promise<Todo[]> {
    const files = await workspace.findFiles(
      pattern(Decoration.include()),
      pattern(Decoration.exclude()),
      Decoration.maxResults()
    );
    const decoder = new TextDecoder();

    const items = await Promise.all(
      files.map(async (file) => {
        let bytes: Uint8Array;

        try {
          const stat = await workspace.fs.stat(file);
          if (stat.size > MAX_FILE_SIZE) return;

          bytes = await workspace.fs.readFile(file);
        } catch {
          return;
        }

        // git-style binary sniff: a NUL byte in the first 8KB means binary, not text
        if (bytes.subarray(0, 8000).includes(0)) return;

        const text = decoder.decode(bytes);

        if (!text.includes(TODO)) return;

        const todos: Todo[] = [];
        const lines = text.split('\n');
        let k = 1;

        for (let j = 0; j < lines.length; j++) {
          const index = lines[j].indexOf(TODO);
          if (index === -1) continue;

          const todoText = lines[j].slice(index + TODO.length).trim();
          if (todoText) {
            todos.push(new Todo(`${k}. ${todoText}`, undefined, file, j));
            k++;
          }
        }

        if (!todos.length) return;

        const fileName = file.path.split('/').pop() ?? 'unknown';

        return new Todo(fileName, todos, file);
      })
    );

    const list = items.filter((item): item is Todo => !!item);

    this._onDidCountTodos.fire(
      list.reduce((total, { children }) => total + (children?.length ?? 0), 0)
    );

    return list.sort(({ label: label1 }, { label: label2 }) =>
      label1.toLowerCase().localeCompare(label2.toLowerCase())
    );
  }

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}

class Todo extends TreeItem {
  label: string;
  children: Todo[] | undefined;

  constructor(label: string, children?: Todo[], path?: Uri, col?: number) {
    super(label, children ? TreeItemCollapsibleState.Expanded : TreeItemCollapsibleState.None);
    this.label = label;
    this.children = children;

    if (children) {
      const dir = path ? workspace.asRelativePath(path).split('/').slice(0, -1).join('/') : '';

      this.resourceUri = path;
      this.iconPath = ThemeIcon.File;
      this.description = dir ? `${dir} · ${children.length}` : `${children.length}`;
    } else {
      this.command = {
        command: COMMANDS.OPEN_FILE,
        title: 'Open file',
        arguments: [path, col]
      };
    }
  }
}

function pattern(glob: string[]): GlobPattern {
  return '{' + glob.join(',') + '}';
}
