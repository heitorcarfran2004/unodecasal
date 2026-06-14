import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync } from "node:fs";
const font = readFileSync("assets/fonts/Baloo2.ttf");
function mini(hex:string,n:string){
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 63 88" width="63" height="88">
    <rect width="63" height="88" rx="9" fill="${hex}"/>
    <ellipse cx="31.5" cy="44" rx="23" ry="38" transform="rotate(35 31.5 44)" fill="#ffffff"/>
    <text x="31.5" y="47" text-anchor="middle" dominant-baseline="middle" font-size="34" font-weight="800" font-style="italic" fill="${hex}">${n}</text>
    <text x="8.5" y="18" text-anchor="middle" font-size="14" font-weight="800" font-style="italic" fill="#ffffff">${n}</text>
    <text x="54.5" y="74" text-anchor="middle" font-size="14" font-weight="800" font-style="italic" fill="#ffffff" transform="rotate(180 54.5 70)">${n}</text>
  </svg>`;
}
const cards=[["#e01b24","1"],["#0e74c4","2"],["#16a44c","3"]];
const cardW=140, gap=20;
let inner="";
cards.forEach(([hex,n],i)=>{ inner+=mini(hex,n).replace("<svg ", `<svg x="${i*(cardW+gap)}" y="0" `); });
const W=cards.length*cardW+(cards.length-1)*gap, H=cardW*88/63;
const sheet=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="#faf3e7"/>${inner}</svg>`;
writeFileSync("minicard.png", new Resvg(sheet,{font:{fontBuffers:[font],defaultFontFamily:"Baloo 2",loadSystemFonts:false},fitTo:{mode:"width",value:W*3}}).render().asPng());
console.log("ok");
