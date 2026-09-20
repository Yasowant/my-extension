# Publishing Dusk Forge

Publisher: `yasowant`
Extension ID: `yasowant.ember-dusk-yasowant`
Display name: `Dusk Forge`

Keep the publisher and extension ID unchanged when releasing updates. Increase the package version, package with `npx @vscode/vsce package`, then use **Update** for the existing extension at https://marketplace.visualstudio.com/manage/publishers/yasowant.

The package contains Dark and Light variants. The Dark variant keeps the theme ID `Dusk Forge` for compatibility with existing selections. The Light variant uses `Dusk Forge Light`.

Before publishing, validate JSON, confirm contribution paths exist, check text contrast for both variants, and inspect the package contents. Test the themes in VS Code with representative code and language extensions when available.
