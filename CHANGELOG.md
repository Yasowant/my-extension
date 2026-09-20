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
