import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync } from "node:fs";
const photo = readFileSync("assets/test-photo.jpg");
const uri = `data:image/jpeg;base64,${photo.toString("base64")}`;
const B = { x: 44, y: 95, w: 700, h: 1084, r: 58 };
function comp(svg:string,id:string){
  if(id==="back") return svg;
  const clip=`pc${id.replace(/[^a-z0-9]/gi,"")}`;
  const layer=`<defs><clipPath id="${clip}"><rect x="${B.x}" y="${B.y}" width="${B.w}" height="${B.h}" rx="${B.r}"/></clipPath></defs>`+
    `<image href="${uri}" xlink:href="${uri}" x="${B.x}" y="${B.y}" width="${B.w}" height="${B.h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clip})"/>`;
  return svg.replace(/(<svg[^>]*?>)/, `$1${layer}`);
}
const keys=["3-red","4-red","4-green","5-red","9-green","draw2-yellow","reverse-blue","skip-green","wild","wild4","back","0-blue"];
const cols=6, cardW=150, cardH=Math.round(cardW*1275/810), labelH=24, cellW=cardW+12, cellH=cardH+labelH;
const rows=Math.ceil(keys.length/cols);
let cells="";
keys.forEach((k,idx)=>{
  const svg=comp(readFileSync(`public/cards/${k}.svg`,"utf8"),k);
  const png=new Resvg(svg,{fitTo:{mode:"width",value:cardW*2}}).render().asPng();
  const u=`data:image/png;base64,${Buffer.from(png).toString("base64")}`;
  const c=idx%cols,r=Math.floor(idx/cols),x=c*cellW+10,y=r*cellH+10;
  cells+=`<text x="${x+cardW/2}" y="${y+17}" font-size="15" font-family="sans-serif" fill="#fff" font-weight="bold" text-anchor="middle">${k}</text>`;
  cells+=`<image href="${u}" x="${x}" y="${y+labelH}" width="${cardW}" height="${cardH}"/>`;
});
const W=cols*cellW+20,H=rows*cellH+20;
const s=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="#2b2440"/>${cells}</svg>`;
writeFileSync("verify-keys.png",new Resvg(s,{fitTo:{mode:"width",value:W}}).render().asPng());
console.log("ok");
