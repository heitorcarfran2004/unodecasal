import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync } from "node:fs";
const dir = "C:/Users/thorz/Downloads/Cartas Uno";
const photo = readFileSync("assets/test-photo.jpg");
const uri = `data:image/jpeg;base64,${photo.toString("base64")}`;
// shared card-body bounds (viewBox 810x1275)
const B = { x: 44, y: 95, w: 700, h: 1084, r: 58 };
function composite(svg: string, id: number){
  const clip=`pc${id}`;
  const layer=`<defs><clipPath id="${clip}"><rect x="${B.x}" y="${B.y}" width="${B.w}" height="${B.h}" rx="${B.r}"/></clipPath></defs>`+
    `<image href="${uri}" xlink:href="${uri}" x="${B.x}" y="${B.y}" width="${B.w}" height="${B.h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clip})"/>`;
  return svg.replace(/(<svg[^>]*?>)/, `$1${layer}`);
}
const cols=8, cardW=130, cardH=Math.round(cardW*1275/810), labelH=20, cellW=cardW+12, cellH=cardH+labelH;
const rows=Math.ceil(51/cols);
let cells="";
for(let i=1;i<=51;i++){
  let svg=readFileSync(`${dir}/${i}.svg`,"utf8");
  if(i!==51) svg=composite(svg,i); // back has no oval
  const png=new Resvg(svg,{fitTo:{mode:"width",value:cardW*2}}).render().asPng();
  const u=`data:image/png;base64,${Buffer.from(png).toString("base64")}`;
  const c=(i-1)%cols,r=Math.floor((i-1)/cols),x=c*cellW+10,y=r*cellH+10;
  cells+=`<text x="${x+cardW/2}" y="${y+14}" font-size="13" font-family="sans-serif" fill="#fff" text-anchor="middle">#${i}</text>`;
  cells+=`<image href="${u}" x="${x}" y="${y+labelH}" width="${cardW}" height="${cardH}"/>`;
}
const W=cols*cellW+20,H=rows*cellH+20;
const s=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="#2b2440"/>${cells}</svg>`;
writeFileSync("full-deck.png",new Resvg(s,{fitTo:{mode:"width",value:W}}).render().asPng());
console.log("ok");
