# Regression tests

Run `npm ci`, then `npm test` from the repository root.
The tests read the real grammars shipped with your installed VS Code. On macOS
VS Code's standard /Applications location is used automatically. Elsewhere set
`VSCODE_GRAMMARS` to the absolute VS Code `resources/app/extensions/` directory,
including its trailing slash. This avoids silently testing an unrelated grammar.

Coverage: both palettes; JS, JSX, TS and TSX method colours; comment/string and
Map/ordinary-object exclusions; Express route chains and termination; React props
and component colours; JSON string colours; SQL keyword colours; tokenization of
all sample workspace files; semantic-overlay default; and composited contrast
for selection, search, diff and merge states, including selected search/diff lines.

These tests do not launch VS Code's UI or Angular's language service. Use the
manual checklist in examples/README.md for real-project editor validation before
release. Third-party themes, user overrides and grammar versions can change results.
