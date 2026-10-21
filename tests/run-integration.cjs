const path = require('path');
const { runTests } = require('@vscode/test-electron');
const root = path.resolve(__dirname, '..');
(async () => {
  await runTests({
    extensionDevelopmentPath: root,
    extensionTestsPath: path.join(__dirname, 'integration.cjs'),
    ...(process.env.VSCODE_EXECUTABLE ? { vscodeExecutablePath: process.env.VSCODE_EXECUTABLE } : { version: 'stable' }),
    launchArgs: ['--user-data-dir=' + path.join(root, '.test-profile'), '--extensions-dir=' + path.join(root, '.test-extensions'), '--skip-welcome', '--skip-release-notes', '--disable-updates']
  });
})().catch(error => { console.error(error); process.exit(1); });
