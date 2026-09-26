const fs=require('fs'),path=require('path'),assert=require('assert');
const tm=require('vscode-textmate'),onig=require('vscode-oniguruma');
const root=path.resolve(__dirname,'..');
const built=process.env.VSCODE_GRAMMARS || '/Applications/Visual Studio Code.app/Contents/Resources/app/extensions/';
const grammars={
'source.js':built+'javascript/syntaxes/JavaScript.tmLanguage.json',
'source.js.jsx':built+'javascript/syntaxes/JavaScriptReact.tmLanguage.json',
'source.ts':built+'typescript-basics/syntaxes/TypeScript.tmLanguage.json',
'source.tsx':built+'typescript-basics/syntaxes/TypeScriptReact.tmLanguage.json',
'source.json':built+'json/syntaxes/JSON.tmLanguage.json',
'source.sql':built+'sql/syntaxes/sql.tmLanguage.json',
 'text.html.basic':built+'html/syntaxes/html.tmLanguage.json'};
const pkg=JSON.parse(fs.readFileSync(root+'/package.json'));
for(const g of pkg.contributes.grammars)grammars[g.scopeName]=root+'/'+g.path;
(async()=>{
await onig.loadWASM(fs.readFileSync(require.resolve('vscode-oniguruma/release/onig.wasm')).buffer);
let checks=0;
for(const themeName of ['dark','light']){
const theme=JSON.parse(fs.readFileSync(root+'/themes/dusk-forge-'+themeName+'.json'));
const registry=new tm.Registry({onigLib:Promise.resolve({createOnigScanner:s=>new onig.OnigScanner(s),createOnigString:s=>new onig.OnigString(s)}),theme:{settings:[{settings:{foreground:theme.colors['editor.foreground'],background:theme.colors['editor.background']}},...theme.tokenColors]},loadGrammar:async scope=>grammars[scope]?tm.parseRawGrammar(fs.readFileSync(grammars[scope],'utf8'),grammars[scope]):null,getInjections:scope=>pkg.contributes.grammars.filter(g=>g.injectTo.includes(scope)).map(g=>g.scopeName)});
for(const scope of ['source.js','source.js.jsx','source.ts','source.tsx']){
const grammar=await registry.loadGrammar(scope);
for(const verb of ['get','post','put','patch','delete']){
const expected=theme.tokenColors.find(t=>t.name==='HTTP verb — '+verb.toUpperCase()).settings.foreground.toUpperCase();
for(const line of [`router.${verb}('/users', handler);`,`router.${verb}(`,`axios.${verb}('/users');`,`fetch('/users', { method: '${verb.toUpperCase()}' });`,`export async function ${verb.toUpperCase()}(req) {}`]){
const word=line.includes('method:')||line.startsWith('export')?verb.toUpperCase():verb;
const start=line.indexOf(word),tokens=grammar.tokenizeLine2(line,tm.INITIAL).tokens;
let actual;
for(let i=0;i<tokens.length;i+=2)if(tokens[i]<=start&&(i+2===tokens.length||tokens[i+2]>start))actual=registry.getColorMap()[(tokens[i+1]>>>15)&511].toUpperCase();
assert.equal(actual,expected,`${themeName} ${scope} ${line}: expected ${expected}, got ${actual}`);checks++;
}
}
let chainState=tm.INITIAL;
for(const line of ["router.route('/users')",'  .get(listUsers)','  .post(createUser);',"cache.get('/users');"]){
 const result=grammar.tokenizeLine(line,chainState);chainState=result.ruleStack;
 const scopes=result.tokens.flatMap(t=>t.scopes);
 if(line.includes('.get(list'))assert(scopes.includes('entity.name.function.http-verb.get.ember'),'chain GET');
 if(line.includes('.post'))assert(scopes.includes('entity.name.function.http-verb.post.ember'),'chain POST');
 if(line.startsWith('cache'))assert(!scopes.some(s=>s.includes('http-verb')),'chain scope must terminate');
 checks++;
}
// Never inject HTTP scopes into prose strings or comments.
for(const line of [`// router.delete('/users')`,`const text = "router.delete('/users')";`, `cache.get('/users');`, `new Map().delete('/users');`, `map.get('/users');`, `obj.patch('/users');`]){
assert(!grammar.tokenizeLine(line,tm.INITIAL).tokens.some(t=>t.scopes.some(s=>s.includes('http-verb'))),line);checks++;
}
}
for(const [scope,file] of [['source.tsx','UserCard.tsx'],['source.ts','user.component.ts'],['text.html.basic','user.component.html'],['source.json','document.json'],['source.sql','query.sql']]){
 const gram=await registry.loadGrammar(scope);assert(gram,scope);let state=tm.INITIAL;
 for(const line of fs.readFileSync(root+'/examples/'+file,'utf8').split('\n')){const result=gram.tokenizeLine(line,state);state=result.ruleStack;assert(!result.stoppedEarly);checks++;}
}
for(const scope of ['source.js','source.js.jsx','source.tsx']){
 const gram=await registry.loadGrammar(scope);let state=tm.INITIAL;
 for(const line of ['const view = <p>', '  Multiline text', '  {name}', '</p>;']){
  const result=gram.tokenizeLine2(line,state);state=result.ruleStack;
  if(line.includes('Multiline')){const metadata=result.tokens[1];assert.equal(registry.getColorMap()[(metadata>>>15)&511].toUpperCase(),theme.tokenColors.find(x=>x.name==='JSX visible text').settings.foreground.toUpperCase());checks++;}
 }
}
const jsxText=theme.tokenColors.find(x=>x.name==='JSX visible text').settings.foreground;
const cases=[
 ...['source.js','source.js.jsx','source.tsx'].flatMap(scope=>[
  [scope,'const view = <p>dasdasdasd</p>;','dasdasdasd',jsxText],
  [scope,'const view = <><p>Hello <strong>world</strong></p></>;','world',jsxText],
  [scope,'const view = <p title="Hello">Text {name}</p>;','name',theme.colors['editor.foreground']],
  [scope,'const view = <p title="Hello">Text {name}</p>;','Hello',theme.tokenColors.find(x=>x.name==='Strings').settings.foreground],
  [scope,'const view = <p>Text</p>;','p>',theme.tokenColors.find(x=>x.name==='JSX / HTML tags').settings.foreground]
 ]),
 ['source.tsx','const view = <UserCard active={true} />;','UserCard',theme.tokenColors.find(x=>x.name.startsWith('Classes, types')).settings.foreground],
 ['source.tsx','const view = <div className="card" />;','className',theme.tokenColors.find(x=>x.name==='Tag attributes / props').settings.foreground],
 ['source.json','{"name": "Ada"}','"Ada"',theme.tokenColors.find(x=>x.name.toLowerCase().includes('strings')).settings.foreground],
 ['source.sql','SELECT id FROM users;','SELECT',theme.tokenColors.find(x=>x.name==='SQL and PostgreSQL statement keywords').settings.foreground]
];
for(const [scope,line,word,expected] of cases){
 const gram=await registry.loadGrammar(scope),tokens=gram.tokenizeLine2(line,tm.INITIAL).tokens,start=line.indexOf(word);let actual;
 for(let i=0;i<tokens.length;i+=2)if(tokens[i]<=start&&(i+2===tokens.length||tokens[i+2]>start))actual=registry.getColorMap()[(tokens[i+1]>>>15)&511];
 assert.equal(actual.toUpperCase(),expected.toUpperCase(),scope+' '+word);checks++;
}
assert.equal(theme.semanticHighlighting,false,'Semantic overlays must be opt-in to preserve HTTP token colours');
}
console.log(`${checks} real TextMate token colour and exclusion checks passed across JS, JSX, TS, TSX and both themes.`);
})().catch(e=>{console.error(e);process.exit(1)});
