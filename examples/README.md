# Dusk Forge sample workspace

Open this folder in VS Code and select Dusk Forge Dark or Dusk Forge Light.
These small highlighting fixtures are not a deployable application. They require
no database connection, secrets, or running server. React/Angular imports require
those frameworks if you choose to compile the examples; unresolved-import
squiggles in this standalone folder are expected.

- routes.js: direct HTTP calls, multiline arguments, Express route chains and Map false-positive controls.
- UserCard.tsx: component names, native tags, props, hooks and TypeScript types.
- user.component.ts / .html: decorators, properties and Angular bindings. Install Angular Language Service for Angular-specific template interpretation.
- document.json: MongoDB-style JSON keys, strings, booleans, numbers and null.
- query.sql: PostgreSQL SQL; exact highlighting depends on the installed SQL grammar.

Visual checks in BOTH themes:
1. Select a whole line and a single word; text must remain readable.
2. Find 'users'; compare the active match with other matches.
3. Check Problems, hover diagnostics and keyboard focus outlines.
4. Open an existing Git diff and a merge conflict; distinguish added, removed, current and incoming content by borders/labels as well as colour.
5. In a real runnable project, pause on a breakpoint and inspect the current stack frame.
6. Use Developer: Inspect Editor Tokens and Scopes to report unexpected colours.

Do not paste real credentials into screenshots. See ../README.md for semantic-highlighting overrides.
