import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync } from "node:fs";
const dir = "C:/Users/thorz/Downloads/Cartas SVG";
const N = 55, cols = 8, cardW = 120, cardH = Math.round(cardW*1275/810), labelH = 18, cellW = cardW+10, cellH = cardH+labelH;
const rows = Math.ceil(N/cols);
let cells = "";
for (let i=1;i<=N;i++){
  const svg = readFileSync(`${dir}/${i}.svg`,"utf8");
  const png = new Resvg(svg,{fitTo:{mode:"width",value:cardW*2}}).render().asPng();
  const u = `data:image/png;base64,${Buffer.from(png).toString("base64")}`;
  const c=(i-1)%cols, r=Math.floor((i-1)/cols), x=c*cellW+8, y=r*cellH+8;
  cells += `<text x="${x+cardW/2}" y="${y+13}" font-size="12" font-family="sans-serif" font-weight="bold" fill="#fff" text-anchor="middle">${i}</text>`;
  cells += `<image href="${u}" x="${x}" y="${y+labelH}" width="${cardW}" height="${cardH}"/>`;
}
const W=cols*cellW+16, H=rows*cellH+16;
writeFileSync("contact-new.png", new Resvg(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="#2b2440"/>${cells}</svg>`,{fitTo:{mode:"width",value:W}}).render().asPng());
console.log("ok",W,H);
