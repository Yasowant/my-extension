const assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..'),manifest=require('../package.json');
const handlers={},calls=[],reports=[],messages=[];let pick,diagnostics=[];
const start={line:2,compareTo:()=>0};const doc={uri:'file:///example.ts',languageId:'typescript',isClosed:false};
const editor={document:doc,revealRange:r=>calls.push(['reveal',r])};
const api={
 workspace:{getConfiguration:section=>({get:(key,fallback)=>key==='colorTheme'?'Dusk Forge Dark':key==='semanticHighlighting.enabled'?true:fallback}),openTextDocument:async x=>{reports.push(x.content);return x;}},
 window:{activeTextEditor:editor,showTextDocument:async()=>editor,showQuickPick:async items=>pick===undefined?undefined:items[pick],showInformationMessage:async m=>messages.push(m),showErrorMessage:async m=>messages.push(m)},
 commands:{registerCommand:(id,fn)=>{handlers[id]=fn;return {dispose(){}};},executeCommand:async(...args)=>calls.push(args)},
 languages:{getDiagnostics:()=>diagnostics},DiagnosticSeverity:{Error:0,Warning:1},Selection:class{constructor(a,b){this.start=a;this.end=b;}}
};const sandbox={require:n=>{assert.equal(n,'vscode');return api;},module:{exports:{}}};vm.runInNewContext(fs.readFileSync(root+'/src/extension.js','utf8'),sandbox);const context={subscriptions:[]};sandbox.module.exports.activate(context);
(async()=>{
assert.equal(context.subscriptions.length,5);for(const c of manifest.contributes.commands)assert(handlers[c.command]);
await handlers['duskForge.troubleshoot']();assert(reports[0].includes('explicitly enabled'));assert(reports[0].includes('Dusk Forge Dark'));
api.window.activeTextEditor=undefined;await handlers['duskForge.fileProblems']();await handlers['duskForge.quickFix']();assert.equal(calls.length,0);assert(messages.some(x=>x.includes('Open a code file')));
api.window.activeTextEditor=editor;await handlers['duskForge.fileProblems']();assert(messages.some(x=>x.includes('does not guarantee')));
diagnostics=[{range:{start},severity:0,message:'Type mismatch',source:'ts'}];pick=undefined;await handlers['duskForge.fileProblems']();assert.equal(calls.length,0);
pick=0;await handlers['duskForge.fileProblems']();assert(calls.some(c=>c[0]==='editor.action.codeAction'&&c[1].apply==='never'));assert.equal(editor.selection.start,start);
calls.length=0;pick=1;await handlers['duskForge.developerSetup']();assert.equal(calls[0][0],'extension.open');assert.equal(calls[0][1],'dbaeumer.vscode-eslint');
for(const s of manifest.contributes.snippets){const snippets=JSON.parse(fs.readFileSync(path.join(root,s.path)));assert(Object.keys(snippets).length);for(const value of Object.values(snippets)){assert(value.prefix.startsWith('df'));assert(Array.isArray(value.body));}}
assert(require('../snippets/web.json')['Parameterized PostgreSQL query'].body.join('\n').includes('\\$1'));
console.log('Toolkit tests passed: command registration, settings report, empty editor, no diagnostics, cancellation, diagnostic navigation, review-only quick fixes, setup and snippet manifests.');
})().catch(e=>{console.error(e);process.exit(1)});
