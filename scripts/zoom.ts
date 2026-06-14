import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync } from "node:fs";
const dir = "C:/Users/thorz/Downloads/Cartas Uno";
const ids = Array.from({length: 51-33+1}, (_,k)=>k+33); // 33..51
const cols = 5, cellW = 240, cardW = 220, cardH = Math.round(cardW*1275/810), labelH=30, cellH=cardH+labelH;
const rows = Math.ceil(ids.length/cols);
let cells="";
ids.forEach((i,idx)=>{
  const svg = readFileSync(`${dir}/${i}.svg`,"utf8");
  const png = new Resvg(svg,{fitTo:{mode:"width",value:cardW*2}}).render().asPng();
  const uri=`data:image/png;base64,${Buffer.from(png).toString("base64")}`;
  const c=idx%cols, r=Math.floor(idx/cols), x=c*cellW+10, y=r*cellH+10;
  cells+=`<text x="${x+cardW/2}" y="${y+22}" font-size="22" font-family="sans-serif" font-weight="bold" fill="#fff" text-anchor="middle">${i}</text>`;
  cells+=`<image href="${uri}" x="${x}" y="${y+labelH}" width="${cardW}" height="${cardH}"/>`;
});
const W=cols*cellW+20,H=rows*cellH+20;
const sheet=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="#2b2440"/>${cells}</svg>`;
writeFileSync("zoom.png", new Resvg(sheet,{fitTo:{mode:"width",value:W}}).render().asPng());
console.log("ok");
