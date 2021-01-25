export const VIEWS = {
  TODO_LIST: 'todo-list'
};

export const COMMANDS = {
  REFRESH: 'simpleTodoHighlighter.refreshList',
  OPEN_FILE: 'simpleTodoHighlighter.openFile'
};

export const MAX_RESULTS = 512;

export const TODO = 'TODO:';

export const REGEX = new RegExp(TODO, 'g');

export const INCLUDE = [
  '**/*'
];

export const EXCLUDE = [
  '**/node_modules/**',
  '**/dist/**',
  '**/out/**',
  '**/build/**',
  '**/.*/**'
];
