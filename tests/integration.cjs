const vscode=require('vscode'),assert=require('assert'),fs=require('fs'),path=require('path');
exports.run=async()=>{
 const ext=vscode.extensions.getExtension('yasowant.ember-dusk-yasowant');assert(ext);await ext.activate();
 const registered=await vscode.commands.getCommands(true);for(const item of ext.packageJSON.contributes.commands)assert(registered.includes(item.command));
 for(const entry of ext.packageJSON.contributes.snippets){
  const snippets=JSON.parse(fs.readFileSync(path.join(ext.extensionPath,entry.path),'utf8'));
  for(const [name,s]of Object.entries(snippets)){
   const doc=await vscode.workspace.openTextDocument({language:entry.language,content:''});const editor=await vscode.window.showTextDocument(doc);
   assert(await editor.insertSnippet(new vscode.SnippetString(s.body.join('\n'))));
   const text=doc.getText();assert(text.length>0);assert(!text.includes('${'),name+' has unexpanded placeholders');
   if(s.prefix==='dfquery')assert(text.includes('WHERE id = $1'),text);
   await vscode.commands.executeCommand('workbench.action.revertAndCloseActiveEditor');
  }
 }
 const doc=await vscode.workspace.openTextDocument({language:'javascriptreact',content:'const view = <p>dasdasdasd</p>;'});await vscode.window.showTextDocument(doc);
 await vscode.commands.executeCommand('duskForge.troubleshoot');assert(vscode.window.activeTextEditor.document.getText().includes('javascriptreact'));
 fs.writeFileSync(path.join(ext.extensionPath,'../../integration-141-result.json'),JSON.stringify({passed:true,checks:'Extension activation, all command registration, all contributed snippet expansions, literal SQL parameter, live troubleshooting command'}));
};
