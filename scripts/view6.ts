import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync } from "node:fs";
const dir = "C:/Users/thorz/Downloads/iloveimg-compressed";
const cardW=150, labelH=24;
let inner="";
for(let i=1;i<=6;i++){
  const b=readFileSync(`${dir}/${i}.png`);
  const uri=`data:image/png;base64,${b.toString("base64")}`;
  const x=(i-1)*(cardW+12)+10;
  inner+=`<text x="${x+cardW/2}" y="18" font-size="16" font-family="sans-serif" font-weight="bold" fill="#fff" text-anchor="middle">${i}.png</text>`;
  inner+=`<image href="${uri}" x="${x}" y="${labelH}" width="${cardW}" height="${Math.round(cardW*1.57)}" preserveAspectRatio="xMidYMid meet"/>`;
}
const W=6*(cardW+12)+20, H=labelH+Math.round(cardW*1.57)+20;
const s=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="#2b2440"/>${inner}</svg>`;
writeFileSync("view6.png", new Resvg(s,{fitTo:{mode:"width",value:W}}).render().asPng());
console.log("ok", W,H);
