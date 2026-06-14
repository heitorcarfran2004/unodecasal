import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { compositeCard, CARD_BODY } from "../lib/deck";

mkdirSync("public/compare", { recursive: true });
const photo = readFileSync("assets/test-photo.jpg");
const uri = `data:image/jpeg;base64,${photo.toString("base64")}`;
const OUT_W = 760;

const ry = readFileSync("public/cards/reverse-yellow.svg", "utf8");

// "de vocês" — real card art + photo behind the oval
const voces = compositeCard(ry, { key: "reverse-yellow", photoHref: uri, uid: "v" });
writeFileSync("public/compare/voces.png", new Resvg(voces, { fitTo: { mode: "width", value: OUT_W } }).render().asPng());

// "UNO normal" placeholder — fill the oval yellow + draw the reverse symbol
const vb = (/viewBox="([^"]+)"/.exec(ry)?.[1] ?? "0 0 810 1275").split(/\s+/).map(Number);
const cx = vb[2] / 2, cy = vb[3] / 2;
const { x, y, w, h, r } = CARD_BODY;
const backing = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="#f7c600"/>`;
const glyph = `<g transform="translate(${cx} ${cy}) scale(2.9)" fill="#ffffff" stroke="#1b1b1f" stroke-width="2.4" stroke-linejoin="round">
  <path d="M-6 -30 L-6 -44 L-46 -16 L-6 12 L-6 -2 L42 -2 L42 -30 Z"/>
  <path d="M6 30 L6 44 L46 16 L6 -12 L6 2 L-42 2 L-42 30 Z"/>
</g>`;
let normal = ry.replace(/(<svg[^>]*?>)/, `$1${backing}`).replace(/(<\/svg>\s*)$/, `${glyph}$1`);
writeFileSync("public/compare/uno-normal.png", new Resvg(normal, { fitTo: { mode: "width", value: OUT_W } }).render().asPng());
console.log("ok");
