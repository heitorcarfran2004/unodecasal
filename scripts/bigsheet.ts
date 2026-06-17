import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync } from "node:fs";
const dir = "C:/Users/thorz/Downloads/Cartas SVG";
function sheet(from:number,to:number,out:string){
  const cols=5, cardW=200, cardH=Math.round(cardW*1275/810), labelH=26, cellW=cardW+14, cellH=cardH+labelH;
  const ids=[]; for(let i=from;i<=to;i++) ids.push(i);
  const rows=Math.ceil(ids.length/cols);
  let cells="";
  ids.forEach((i,idx)=>{
    const svg=readFileSync(`${dir}/${i}.svg`,"utf8");
    const png=new Resvg(svg,{fitTo:{mode:"width",value:cardW*2}}).render().asPng();
    const u=`data:image/png;base64,${Buffer.from(png).toString("base64")}`;
    const c=idx%cols,r=Math.floor(idx/cols),x=c*cellW+10,y=r*cellH+10;
    cells+=`<text x="${x+cardW/2}" y="${y+20}" font-size="20" font-family="sans-serif" font-weight="bold" fill="#fff" text-anchor="middle">#${i}</text>`;
    cells+=`<image href="${u}" x="${x}" y="${y+labelH}" width="${cardW}" height="${cardH}"/>`;
  });
  const W=cols*cellW+20,H=rows*cellH+20;
  writeFileSync(out,new Resvg(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="#2b2440"/>${cells}</svg>`,{fitTo:{mode:"width",value:W}}).render().asPng());
}
sheet(1,25,"new-A.png");
sheet(26,55,"new-B.png");
console.log("ok");
