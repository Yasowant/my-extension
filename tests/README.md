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

## Live extension-host test (1.4.1)

`integration.cjs` is a VS Code extension test entry point. Launch VS Code with isolated user/extension directories and `--extensionDevelopmentPath=<repository>` plus `--extensionTestsPath=<repository>/tests/integration.cjs`. It activates the extension, checks command registration, expands every contributed snippet, checks the literal SQL `$1` and invokes Check Highlighting in a JSX editor. This requires a working graphical VS Code environment. It has not completed in the build environment; do not count its presence as a passing test.
