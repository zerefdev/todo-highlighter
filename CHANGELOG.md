# Change Log

## [2.0.2] 2026-07-18

### Changed

- New activity bar and marketplace icons

## [2.0.1] 2026-07-15

### Fixed

- Todo count badge now properly appears on startup

## [2.0.0] 2026-07-15

### Added

- Web support: the extension now runs on vscode.dev and github.dev
- Todo count badge on the sidebar icon
- Collapse All button in the todo list
- `maxResults` setting to control how many files are scanned

### Changed

- Moved to the official `yo code` TypeScript + esbuild boilerplate, all dependencies updated
- Extension activates after startup instead of on every event
- Todo list scans files in parallel without opening them as documents (much faster refresh)
- Todo list scans all text files by default instead of a fixed extension list (binary files are skipped)

### Fixed

- Highlight decorations were re-created on every keystroke and never disposed

## [1.0.1] 2021-03-15

### Changed

- Ability to disable background/border (only change text color)

## [1.0.0] 2021-02-01

### Changed

- Extension name & links

_this will probably be the last change until something breaks_

## [0.4.1] 2021-01-31

### Changed

- border radius setting name

## [0.4.0] 2021-01-31

### Added

- Ability to change settings:
  - border radius
  - include/exclude folders/files

## [0.3.0] 2021-01-31

### Added

- Ability to change settings:
  - background/border
  - background/border color
  - text color
  - overview ruler style and color

### Changed

- Extension icon
- Border raduis

## [0.2.0] 2021-01-27

### Added

- Todo list is refreshed when the document is saved
- Todos are now ordered 1. 2. 3. ...
- Todos containers (file names) are now alphabetically sorted

### Fixed

- Python files not included in the list

## [0.1.0] 2021-01-26

### Added

- Support for Stylus, Less, Markdown and Html

## [0.0.1] 2021-01-25

- Initial (pre-)release
