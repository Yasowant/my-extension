# Ember Dusk

**A clean, warm dark theme that colours your API calls by HTTP method.**

`GET` reads teal. `POST` is amber. `PUT` olive, `PATCH` rose, `DELETE` red. In
Express routes, in `fetch` and `axios` calls, in Next.js route handlers, and in
`.http` files — so you can scan a router file and see what it does before you
read a single path.

Built for **Next.js, React, TypeScript and Node/Express**.

---

## Why this exists

Every other theme paints `router.get`, `router.post` and `router.delete` the
exact same colour, because a colour theme can only see *syntax*, not words. A
route file becomes an undifferentiated wall.

Ember Dusk ships a tiny **grammar injection** alongside the theme that teaches
the editor what an HTTP verb is. That's the whole trick, and it's why no theme
you've installed before does this.

```ts
router.get   ('/orders',      listOrders);    //  teal   — safe, read-only
router.post  ('/orders',      createOrder);   //  amber  — creates
router.put   ('/orders/:id',  replaceOrder);  //  olive  — replaces
router.patch ('/orders/:id',  updateOrder);   //  rose   — modifies
router.delete('/orders/:id',  removeOrder);   //  red    — destructive
```

The colours are ordered by blast radius. Destructive operations are the ones
that catch your eye.

### Where it works

| Pattern | Example |
| --- | --- |
| Express / Fastify / Koa routers | `app.post('/login', h)` |
| Any router variable | `v1.delete('/users/:id')`, `adminRouter.put(...)` |
| axios & HTTP clients | `axios.get(url)`, `apiClient.patch(url)` |
| `fetch` options | `fetch(url, { method: 'POST' })` |
| **Next.js App Router** | `export async function DELETE(req) {}` |
| `.http` / `.rest` files | `POST https://api.example.com/orders` |

`.http` support matters because the REST Client extension tags *every* verb with
one scope — so even there, no theme can tell them apart. Ember Dusk can.

It is also careful about what it *doesn't* colour: `map.get()`, `map.delete()`,
`localStorage.getItem()` and friends stay ordinary. Verified against the real
VS Code tokenizer, not by eye.

---

## Next.js and React

- **`'use client'` / `'use server'`** — highlighted as the directives they are,
  at the top of the file where you actually look for them.
- **Hooks** — `useState`, `useRouter` and any custom `useAnything` render bold,
  so hook calls separate from ordinary function calls at a glance.
- **Server APIs** — `generateMetadata`, `generateStaticParams`,
  `getServerSideProps`, `revalidatePath`, `notFound` and the rest are marked as
  framework calls, not as your code.
- **JSX** — components are jade, DOM elements ember, props clay. `<Card
  variant="outlined">` separates into three readable parts.
- **TypeScript** — types, interfaces and generics share one jade family.

## The palette

| Role | Colour |
| --- | --- |
| Background | `#1C1917` |
| Foreground | `#E6D9C9` |
| Keywords, JSX tags | `#E07B5F` ember |
| Functions, hooks | `#E5B25D` amber |
| Strings | `#A5B86B` sage |
| Types, components | `#7FB8A8` jade |
| Numbers, `const` | `#CE8E9E` rose |
| Props, attributes | `#D3A46A` clay |
| Comments | `#948271` |

A single flat background across editor, sidebar and panel — borders do the
separating, not competing shades of grey. Italics on comments only.

Every syntax colour clears WCAG AA (4.5:1) against the background.

## Install

```
ext install yasowant.ember-dusk
```

Then `Ctrl/Cmd + K` `Ctrl/Cmd + T` → **Ember Dusk**.

## Recommended settings

```jsonc
{
  "workbench.colorTheme": "Ember Dusk",
  "editor.fontFamily": "JetBrains Mono, Fira Code, monospace",
  "editor.fontLigatures": true,
  "editor.semanticHighlighting.enabled": true,
  "editor.bracketPairColorization.enabled": true
}
```

## FAQ

**Does the injection slow anything down?**
No. It's three small regex rules evaluated during tokenization, which the editor
already runs on every line.

**Will it break my other themes?**
No. The scopes degrade gracefully — under any other theme, `router.post` still
matches `entity.name.function` and renders exactly as it does today.

**A verb in my codebase isn't picked up.**
Open an issue with the line. The matcher recognises common router names plus any
`.verb()` whose first argument is a route string, but real codebases are
inventive.

## License

MIT
