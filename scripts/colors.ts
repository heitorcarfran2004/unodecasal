import { readFileSync } from "node:fs";
const dir = "C:/Users/thorz/Downloads/Cartas Uno";
const targets: Record<string,[number,number,number]> = {
  red:[224,27,36], yellow:[247,198,0], green:[22,164,76], blue:[14,116,196], black:[24,23,28]
};
function near(r:number,g:number,b:number){
  let best="?",bd=1e9;
  for(const[k,[R,G,B]]of Object.entries(targets)){
    const d=(r-R)**2+(g-G)**2+(b-B)**2; if(d<bd){bd=d;best=k;}
  }
  return bd<8000?best:"?";
}
for(let i=1;i<=51;i++){
  const svg=readFileSync(`${dir}/${i}.svg`,"utf8");
  const hexes=[...svg.matchAll(/#([0-9a-fA-F]{6})/g)].map(m=>m[1]);
  const tally:Record<string,number>={};
  for(const h of hexes){
    const r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);
    const c=near(r,g,b); if(c!=="?") tally[c]=(tally[c]||0)+1;
  }
  const top=Object.entries(tally).sort((a,b)=>b[1]-a[1])[0];
  process.stdout.write(`${i}:${top?top[0]:"none"}  ${i%8===0?"\n":""}`);
}
console.log();
