import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync } from "node:fs";
const dir = "C:/Users/thorz/Downloads/Cartas Uno";
const ids=[13,17,21,49,50,51];
const cols=ids.length, cardW=200, cardH=Math.round(cardW*1275/810), labelH=28, cellW=cardW+12, cellH=cardH+labelH;
let cells="";
ids.forEach((i,idx)=>{
  const svg=readFileSync(`${dir}/${i}.svg`,"utf8");
  const png=new Resvg(svg,{fitTo:{mode:"width",value:cardW*2}}).render().asPng();
  const uri=`data:image/png;base64,${Buffer.from(png).toString("base64")}`;
  const x=idx*cellW+10,y=10;
  cells+=`<text x="${x+cardW/2}" y="${y+21}" font-size="22" font-family="sans-serif" font-weight="bold" fill="#fff" text-anchor="middle">#${i}</text>`;
  cells+=`<image href="${uri}" x="${x}" y="${y+labelH}" width="${cardW}" height="${cardH}"/>`;
});
const W=cols*cellW+20,H=cellH+20;
const s=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="#2b2440"/>${cells}</svg>`;
writeFileSync("check.png",new Resvg(s,{fitTo:{mode:"width",value:W}}).render().asPng());
console.log("ok");
