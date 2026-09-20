const fs=require('fs'),path=require('path'),assert=require('assert');
const rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const luminance=v=>v.map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4}).reduce((s,x,i)=>s+x*[.2126,.7152,.0722][i],0);
const ratio=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const composite=(h,b)=>{const a=h.length===9?parseInt(h.slice(7),16)/255:1;return rgb(h).map((x,i)=>x*a+b[i]*(1-a));};
let checks=0,min=100;
for(const mode of ['dark','light']){
const file=path.join(__dirname,'../themes/dusk-forge-'+mode+'.json'),t=JSON.parse(fs.readFileSync(file)),base=rgb(t.colors['editor.background']);
const foregrounds=[t.colors['editor.foreground'],...t.tokenColors.map(x=>x.settings.foreground).filter(Boolean),...Object.values(t.semanticTokenColors).map(v=>typeof v==='string'?v:v.foreground).filter(Boolean)];
const overlays=['editor.selectionBackground','editor.inactiveSelectionBackground','editor.selectionHighlightBackground','editor.findMatchBackground','editor.findMatchHighlightBackground','editor.wordHighlightBackground','editor.wordHighlightStrongBackground','diffEditor.insertedTextBackground','diffEditor.removedTextBackground','diffEditor.insertedLineBackground','diffEditor.removedLineBackground','merge.currentContentBackground','merge.incomingContentBackground','merge.commonContentBackground'];
for(const key of ['base',...overlays])for(const fg of foregrounds){const bg=key==='base'?base:composite(t.colors[key],base);const value=ratio(rgb(fg),bg);min=Math.min(min,value);assert(value>=4.5,`${mode} ${key} ${fg}: ${value.toFixed(2)}:1`);checks++;}
// Real editor states can overlap: selection on a search result or changed line.
for(const key of ['editor.findMatchBackground','diffEditor.insertedLineBackground','diffEditor.removedLineBackground'])for(const fg of foregrounds){const bg=composite(t.colors['editor.selectionBackground'],composite(t.colors[key],base));const value=ratio(rgb(fg),bg);assert(value>=4.5,`${mode} selected ${key} ${fg}: ${value.toFixed(2)}:1`);checks++;}
}
console.log(`${checks} contrast checks passed; minimum individual-state contrast ${min.toFixed(2)}:1.`);
