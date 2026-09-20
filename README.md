# Dusk Forge

Two coordinated VS Code themes for developers: **Dusk Forge Dark** and **Dusk Forge Light**.

Dark uses deep slate surfaces with warm amber, teal, blue and lavender syntax. Light uses soft off-white surfaces with darker ink colours, rather than simply inverting the dark palette.

## Install and select

Search for **Dusk Forge** by **Yasowant Nayak**, or run:

```
ext install yasowant.ember-dusk-yasowant
```

Open **Preferences: Color Theme** and select **Dusk Forge Dark** or **Dusk Forge Light**. Existing users of the Dusk Forge theme retain the dark theme through its stable theme ID.

## Built for reading code

- Distinct colours for keywords, strings, functions, types, properties and constants.
- Readable comments, restrained surfaces, visible keyboard focus and active tabs.
- Search match borders, selection overlays, bracket colours and inlay hints.
- Coordinated Git decorations, diffs, diagnostics, terminal colours and autocomplete menus.
- TextMate and semantic highlighting for supported language extensions.

All configured syntax and semantic foreground colours meet a measured contrast ratio of at least 4.5:1 against their base editor background. This does not certify every UI state or colour-vision accessibility. Highlighting also depends on the language extension and user overrides.

## HTTP methods

The included grammar injections assign distinct scopes to supported HTTP patterns:

| Method | Colour family |
| --- | --- |
| GET | Teal |
| POST | Amber |
| PUT | Green |
| PATCH | Purple |
| DELETE | Red |

Supported patterns include common router calls, fetch method strings, axios calls, Next.js route handlers and `.http` files. The method names remain visible, so colour is an additional cue. Language server semantic tokens can take precedence over grammar scopes in some contexts.

React hook, Next.js API and `use client` / `use server` scopes are preserved from the previous release.

## Palette

| Role | Dark | Light |
| --- | --- | --- |
| Editor | `#141C28` | `#F7F8FA` |
| Text | `#DCE4EE` | `#273344` |
| Comments | `#94A3B8` | `#626F80` |
| Keywords | `#F0A078` | `#A33F26` |
| Functions | `#EBC27C` | `#805700` |
| Strings | `#A8CC8C` | `#3C6527` |
| Types | `#7DCDBB` | `#14685E` |
| Properties / attributes | `#8FBDF2` | `#225EA2` |
| Constants | `#C6A5EF` | `#7444A0` |

## Feedback

[Report an issue](https://github.com/Yasowant/my-extension/issues) with your language, a small code example and the highlighting you expected.

## License

MIT
