import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync } from "node:fs";
const dir = "C:/Users/thorz/Downloads/1 (1)";
const photo = readFileSync("assets/test-photo.jpg");
const uri = `data:image/jpeg;base64,${photo.toString("base64")}`;
const B = { x: 44, y: 95, w: 700, h: 1084, r: 58 };
function comp(svg:string,id:number){
  const clip=`pc${id}`;
  const layer=`<defs><clipPath id="${clip}"><rect x="${B.x}" y="${B.y}" width="${B.w}" height="${B.h}" rx="${B.r}"/></clipPath></defs>`+
    `<image href="${uri}" xlink:href="${uri}" x="${B.x}" y="${B.y}" width="${B.w}" height="${B.h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clip})"/>`;
  return svg.replace(/(<svg[^>]*?>)/, `$1${layer}`);
}
const ids=[17,18,19,20], cardW=200, cardH=Math.round(cardW*1275/810), labelH=26, cellW=cardW+12;
let cells="";
ids.forEach((i,idx)=>{
  const svg=comp(readFileSync(`${dir}/${i}.svg`,"utf8"),i);
  const png=new Resvg(svg,{fitTo:{mode:"width",value:cardW*2}}).render().asPng();
  const u=`data:image/png;base64,${Buffer.from(png).toString("base64")}`;
  const x=idx*cellW+10,y=10;
  cells+=`<text x="${x+cardW/2}" y="${y+20}" font-size="20" font-family="sans-serif" fill="#fff" font-weight="bold" text-anchor="middle">${i}.svg</text>`;
  cells+=`<image href="${u}" x="${x}" y="${y+labelH}" width="${cardW}" height="${cardH}"/>`;
});
const W=ids.length*cellW+20,H=cardH+labelH+20;
const s=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="#2b2440"/>${cells}</svg>`;
writeFileSync("check4.png",new Resvg(s,{fitTo:{mode:"width",value:W}}).render().asPng());
console.log("ok");
