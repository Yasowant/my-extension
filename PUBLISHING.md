# Publishing Ember Dusk to the VS Code Marketplace

Publishing is free and there is no review queue — an extension is live within a
minute or two of upload.

## 0. Test it locally first

```bash
code --install-extension ember-dusk-1.0.0.vsix
```

Then `Cmd/Ctrl + K`, `Cmd/Ctrl + T` → **Ember Dusk**.

To iterate on colours without rebuilding: open the theme JSON, run
**Developer: Inspect Editor Tokens and Colors** from the command palette on any
token, and it tells you exactly which scope to edit.

## 1. Create an Azure DevOps organisation

The Marketplace uses Azure DevOps for identity. It's free.

1. Go to <https://dev.azure.com> and sign in with a Microsoft account.
2. Create an organisation (the name does not matter — nobody sees it).

## 2. Create a Personal Access Token

1. In Azure DevOps: click your avatar → **Personal access tokens** → **New Token**.
2. Set:
   - **Organization**: `All accessible organizations` ← this is required, and the
     single most common reason publishing fails.
   - **Expiration**: up to 1 year.
   - **Scopes**: click *Show all scopes*, find **Marketplace**, tick **Manage**.
3. Copy the token now. It is shown exactly once.

## 3. Create your publisher

1. Go to <https://marketplace.visualstudio.com/manage> and sign in with the same
   Microsoft account.
2. **Create publisher**. The **ID** you choose is permanent and becomes part of
   the install command — pick carefully (e.g. `yasowant`).

Then set that ID as `publisher` in `package.json`. It must match exactly.

## 4. Log in and publish

```bash
npm install -g @vscode/vsce

vsce login yasowant        # paste the PAT when prompted
vsce publish
```

`vsce publish` repackages and uploads in one step. Your theme appears at:

```
https://marketplace.visualstudio.com/items?itemName=yasowant.ember-dusk
```

## 5. Shipping updates

```bash
vsce publish patch   # 1.0.0 → 1.0.1  (colour tweaks)
vsce publish minor   # 1.0.0 → 1.1.0  (new variant, broader language support)
```

These bump `package.json`, then publish. Add a line to `CHANGELOG.md` first —
the Marketplace renders it as a tab on your listing.

## Before you publish — checklist

- [ ] `publisher` in `package.json` matches your real publisher ID
- [ ] `repository.url` points at your actual GitHub repo (remove the field if
      you aren't publishing the source; `vsce` warns but still packages)
- [ ] Update the copyright name in `LICENSE`
- [ ] Add 2–3 real screenshots to `images/` and reference them in `README.md` —
      the README *is* your Marketplace page, and screenshots are the single
      biggest factor in whether people install a theme
- [ ] Take the screenshots at a readable font size with a real project open, not
      lorem-ipsum code

## Getting installs

Themes live or die on discovery, not quality:

- The Marketplace search ranks heavily on install count, so the first hundred are
  the hard ones. `keywords` in `package.json` matter.
- Post the screenshot to r/vscode, the VS Code Discord, and dev.to. A single
  good screenshot outperforms any amount of description.
- Also publish to [Open VSX](https://open-vsx.org) (`npx ovsx publish`) — that's
  what VSCodium, Cursor, Gitpod and Windsurf pull from, and it's much less
  crowded.
