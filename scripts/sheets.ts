import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync } from "node:fs";
const dir = "C:/Users/thorz/Downloads/Cartas Uno";
function sheet(ids:number[], out:string){
  const cols=5, cardW=200, cardH=Math.round(cardW*1275/810), labelH=28, cellW=cardW+18, cellH=cardH+labelH;
  const rows=Math.ceil(ids.length/cols);
  let cells="";
  ids.forEach((i,idx)=>{
    const svg=readFileSync(`${dir}/${i}.svg`,"utf8");
    const png=new Resvg(svg,{fitTo:{mode:"width",value:cardW*2}}).render().asPng();
    const uri=`data:image/png;base64,${Buffer.from(png).toString("base64")}`;
    const c=idx%cols, r=Math.floor(idx/cols), x=c*cellW+10, y=r*cellH+10;
    cells+=`<text x="${x+cardW/2}" y="${y+21}" font-size="22" font-family="sans-serif" font-weight="bold" fill="#fff" text-anchor="middle">#${i}</text>`;
    cells+=`<image href="${uri}" x="${x}" y="${y+labelH}" width="${cardW}" height="${cardH}"/>`;
  });
  const W=cols*cellW+20,H=rows*cellH+20;
  const s=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="#2b2440"/>${cells}</svg>`;
  writeFileSync(out,new Resvg(s,{fitTo:{mode:"width",value:W}}).render().asPng());
}
sheet(Array.from({length:25},(_,k)=>k+1),"sheetA.png");
sheet(Array.from({length:26},(_,k)=>k+26),"sheetB.png");
console.log("ok");
