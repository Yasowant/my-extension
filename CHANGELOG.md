# 1.3.0

- Removed slash-only HTTP detection to avoid colouring Map and ordinary object methods as requests.
- Added balanced Express route-chain highlighting and regression cases for scope termination.
- Refined React component/prop and Angular decorator distinction.
- Added debug, exception, diff and merge borders; reduced overlay opacity and darkened light-theme comments.
- Added automated grammar and composited-contrast tests, a sample workspace, troubleshooting and honest rendered previews.
- Semantic highlighting remains opt-in; IntelliSense and diagnostics are unaffected.

# 1.2.2

- Fixed generic semantic method colours overriding GET, POST, PUT, PATCH and DELETE colours by making semantic overlays opt-in in both themes.
- Preserved optional semantic palettes and all language grammars. IntelliSense and diagnostics are unaffected.
- Added instructions for existing user or workspace semantic highlighting overrides.
- Verified HTTP token colours with VS Code TextMate grammars for JavaScript, JSX, TypeScript and TSX in both themes.

# 1.2.1

- Added explicit SQL and PostgreSQL scope colours for statements, types, constraints, functions and parameters.
- Made JSON document keys and JavaScript/TypeScript object properties consistently blue, including semantic tokens.
- Refined TypeScript decorator and HTML attribute colours for Angular development.
- Preserved existing React, Next.js and HTTP method scopes in both Dark and Light.
- Updated MERN/MEAN documentation with language-extension requirements and limitations.

# 1.2.0

- Added Dusk Forge Light with a dedicated light palette.
- Refined Dusk Forge Dark with slate surfaces and clearer syntax colours.
- Added search borders, inlay hint styling and improved focus cues.
- Preserved HTTP grammar injections and the existing dark theme ID.
- Checked syntax and semantic text contrast against both editor backgrounds.

# 1.1.1

- Renamed the extension and colour theme to Dusk Forge.

# Changelog

## [1.1.0]

**HTTP verbs are now coloured by method.**

- New grammar injection gives `GET`, `POST`, `PUT`, `PATCH` and `DELETE` their
  own colour, ordered by blast radius (teal → amber → olive → rose → red).
  Recognised in Express-style routers, any `.verb()` call taking a route string,
  axios and HTTP clients, `fetch(url, { method })`, Next.js App Router handlers
  (`export async function POST`), and `.http`/`.rest` files.
- Guards against false positives — `map.get()`, `map.delete()` and similar
  built-ins stay ordinary. Verified against the VS Code tokenizer.
- React hooks (`useState` and any custom `useXxx`) now render bold.
- `'use client'` / `'use server'` directives highlighted.
- Next.js server APIs (`generateMetadata`, `generateStaticParams`,
  `getServerSideProps`, `revalidatePath`, `notFound`, …) marked as framework calls.
- `.http` file request URLs, header names and header values themed.

**Cleaner UI.**

- One flat background across editor, sidebar, tabs, panel and status bar;
  separation now comes from borders instead of competing shades.
- Italics reduced to comments and directives only.
- Softer selection, indent guides, whitespace and rulers.

## [1.0.0]

- Initial release: warm dark palette, full workbench theming, syntax and semantic
  tokens for JS/TS/React/Node plus CSS, JSON, YAML, Markdown and shell.
- All syntax colours verified at WCAG AA or better.
