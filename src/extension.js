'use strict';
const vscode = require('vscode');

async function showGuide(content) {
  const document = await vscode.workspace.openTextDocument({ language: 'markdown', content });
  return vscode.window.showTextDocument(document, { preview: true });
}
function configurationScope() {
  const document = vscode.window.activeTextEditor?.document;
  return document ? { uri: document.uri, languageId: document.languageId } : undefined;
}
async function troubleshoot() {
  const scope = configurationScope();
  const theme = vscode.workspace.getConfiguration('workbench').get('colorTheme', 'Unknown');
  const semantic = vscode.workspace.getConfiguration('editor', scope).get('semanticHighlighting.enabled', 'configuredByTheme');
  const tokens = vscode.workspace.getConfiguration('editor', scope).get('tokenColorCustomizations', {}) || {};
  const semanticTokens = vscode.workspace.getConfiguration('editor', scope).get('semanticTokenColorCustomizations', {}) || {};
  return showGuide([
    '# Dusk Forge: Highlighting check', '',
    `Active theme: ${theme}`, `Language mode: ${scope?.languageId || 'No active editor'}`,
    `Semantic highlighting setting: ${semantic}`, '',
    theme.startsWith('Dusk Forge') ? 'A Dusk Forge theme is selected.' : 'Select Dusk Forge Dark or Light using Preferences: Color Theme.',
    'The editor setting above is not the final result: semantic colour customizations can override it.',
    `Global semantic customization enabled: ${semanticTokens.enabled ?? 'not set'}`,
    ...Object.entries(semanticTokens).filter(([key]) => key.startsWith('[')).map(([key,value]) => `${key} semantic enabled: ${value?.enabled ?? 'not set'} (check whether this selector matches your active theme)`),
    'Dusk Forge defaults to grammar colours. Review matching theme-specific customizations when colours differ.',
    `TextMate customizations present: ${Object.keys(tokens).length ? 'yes' : 'no'}`,
    `Semantic customizations present: ${Object.keys(semanticTokens).length ? 'yes — review global and theme-specific enabled/rules entries' : 'no'}`, '',
    '## Suggested checks',
    '1. Confirm the correct language mode in the status bar.',
    '2. Run Developer: Inspect Editor Tokens and Scopes on the unexpected colour.',
    '3. Review user, workspace and language-specific highlighting settings.',
    '4. After updating Dusk Forge, run Developer: Reload Window.', '',
    '## Keep HTTP grammar colours for Dusk Forge',
    'Merge these entries into any existing editor.semanticTokenColorCustomizations setting:',
    '```json', '"editor.semanticTokenColorCustomizations": {',
    '  "[Dusk Forge Dark]": { "enabled": false },',
    '  "[Dusk Forge Light]": { "enabled": false }', '}', '```', '',
    'This report only reads settings; it does not change them or upload project data.'
  ].join('\n'));
}
async function setup() {
  const choices = [
    { label: 'JavaScript / TypeScript', detail: 'Use VS Code built-in IntelliSense and project tsconfig/jsconfig settings.', guide: 'VS Code includes JavaScript and TypeScript language support. Open your project root and use its tsconfig.json or jsconfig.json. Run your project’s existing type-check script. Dusk Forge does not install dependencies or execute project scripts.' },
    { label: 'ESLint', detail: 'View the Microsoft ESLint extension; project configuration is required.', extension: 'dbaeumer.vscode-eslint' },
    { label: 'Angular', detail: 'View Angular Language Service for template support.', extension: 'Angular.ng-template' },
    { label: 'PostgreSQL / SQL', detail: 'Understand highlighting, query parameters and database tools.', guide: 'Dusk Forge styles SQL tokens but does not connect to a database. Install a SQL language extension suited to your project if you need richer PostgreSQL syntax. Keep credentials out of source files and use parameterized queries in your application.' },
    { label: 'Snippets', detail: 'Discover the df-prefixed developer snippets.', guide: 'Type df in a supported file, then trigger suggestions or run Snippets: Insert Snippet. Available prefixes: dfroute, dffetch, dfquery (JS/TS/JSX/TSX), dfreact (JSX), dfreactts (TSX), dfselect and dftransaction (SQL). Snippets are editable starting points; review them before use.' }
  ];
  const choice = await vscode.window.showQuickPick(choices, { title: 'Dusk Forge: Developer Setup', matchOnDetail: true });
  if (!choice) return;
  if (choice.extension) return vscode.commands.executeCommand('extension.open', choice.extension);
  return showGuide('# '+choice.label+'\n\n'+choice.guide);
}
async function problems() {
  const document = vscode.window.activeTextEditor?.document;
  if (!document) return vscode.window.showInformationMessage('Open a code file to view its reported problems.');
  const version = document.version;
  const diagnostics = vscode.languages.getDiagnostics(document.uri)
    .filter(d => d.severity <= vscode.DiagnosticSeverity.Warning)
    .sort((a,b) => a.range.start.compareTo(b.range.start));
  if (!diagnostics.length) return vscode.window.showInformationMessage('No errors or warnings are currently reported for this file. This does not guarantee the code is bug-free.');
  const choice = await vscode.window.showQuickPick(diagnostics.map(d => ({
    label: `${d.severity === vscode.DiagnosticSeverity.Error ? 'Error' : 'Warning'} · Line ${d.range.start.line + 1}`,
    description: d.source || 'Language tool', detail: d.message, diagnostic: d
  })), { title: 'Dusk Forge: Current File Problems', matchOnDetail: true });
  if (!choice) return;
  if (document.isClosed) return vscode.window.showInformationMessage('The original file was closed. Open it and run the command again.');
  if (document.version !== version) return vscode.window.showInformationMessage('This file changed while the problem list was open. Run Current File Problems again for updated locations.');
  const fresh = vscode.languages.getDiagnostics(document.uri).some(d => d.message === choice.diagnostic.message && d.source === choice.diagnostic.source && d.range.start.compareTo(choice.diagnostic.range.start) === 0);
  if (!fresh) return vscode.window.showInformationMessage('That problem is no longer reported. Run Current File Problems again to refresh the list.');
  const editor = await vscode.window.showTextDocument(document);
  editor.selection = new vscode.Selection(choice.diagnostic.range.start, choice.diagnostic.range.start);
  editor.revealRange(choice.diagnostic.range);
  // Open the normal fix picker; never automatically apply a provider's edits.
  return vscode.commands.executeCommand('editor.action.codeAction', { kind: 'quickfix', apply: 'never' });
}
function activate(context) {
  const handlers = {
    'duskForge.troubleshoot': troubleshoot,
    'duskForge.developerSetup': setup,
    'duskForge.fileProblems': problems,
    'duskForge.openProblems': () => vscode.commands.executeCommand('workbench.actions.view.problems'),
    'duskForge.quickFix': () => vscode.window.activeTextEditor
      ? vscode.commands.executeCommand('editor.action.codeAction', { kind: 'quickfix', apply: 'never' })
      : vscode.window.showInformationMessage('Open a code file and place the cursor on a problem first.')
  };
  for (const [id, handler] of Object.entries(handlers)) {
    context.subscriptions.push(vscode.commands.registerCommand(id, async () => {
      try { return await handler(); }
      catch { return vscode.window.showErrorMessage('Dusk Forge could not complete this command. Check that the file is open and the required language tool is available.'); }
    }));
  }
}
module.exports = { activate };
