import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync } from "node:fs";
import { compositeCard } from "../lib/deck";
const font = readFileSync("assets/fonts/Baloo2.ttf");
const back = readFileSync("public/cards/back.svg","utf8");
const svg = compositeCard(back, { key:"back", coupleName:"Francisco & Larissa", uid:"x" });
const r = new Resvg(svg, { font:{ fontBuffers:[font], defaultFontFamily:"Baloo 2", loadSystemFonts:false }, fitTo:{mode:"width",value:380} });
writeFileSync("back-name.png", r.render().asPng());
console.log("ok");
