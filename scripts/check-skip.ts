import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync } from "node:fs";
const items: [string,string][] = [
  ["novo (enviado)", "C:/Users/thorz/Downloads/Cartas SVG.svg"],
  ["atual skip-green", "public/cards/skip-green.svg"],
  ["atual skip-yellow", "public/cards/skip-yellow.svg"],
];
const cardW=200, cardH=Math.round(cardW*1268/810), labelH=26, gap=20;
let inner="";
items.forEach(([label,path],i)=>{
  let png;
  try { png = new Resvg(readFileSync(path,"utf8"),{fitTo:{mode:"width",value:cardW*2}}).render().asPng(); }
  catch(e){ console.log("ERR",path,String(e)); return; }
  const u=`data:image/png;base64,${Buffer.from(png).toString("base64")}`;
  const x=i*(cardW+gap)+10;
  inner+=`<text x="${x+cardW/2}" y="18" font-size="15" font-family="sans-serif" fill="#fff" text-anchor="middle">${label}</text>`;
  inner+=`<image href="${u}" x="${x}" y="${labelH}" width="${cardW}" height="${cardH}"/>`;
});
const W=items.length*(cardW+gap)+10,H=cardH+labelH+14;
writeFileSync("check-skip.png", new Resvg(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="#2b2440"/>${inner}</svg>`,{fitTo:{mode:"width",value:W}}).render().asPng());
console.log("ok");
