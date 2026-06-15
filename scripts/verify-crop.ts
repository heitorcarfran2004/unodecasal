import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync } from "node:fs";
import { compositeCard } from "../lib/deck";

function jpegSize(buf: Buffer) {
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) { i++; continue; }
    const m = buf[i + 1];
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
      return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return { w: 700, h: 850 };
}

const font = readFileSync("assets/fonts/Baloo2.ttf");
const buf = readFileSync("assets/test-photo.jpg");
const { w, h } = jpegSize(buf);
const uri = `data:image/jpeg;base64,${buf.toString("base64")}`;
const aspect = w / h;
const art = readFileSync("public/cards/7-blue.svg", "utf8");

function card(focalY: number, uid: string) {
  return compositeCard(art, { key: "7-blue", photo: { url: uri, focalX: 0.5, focalY, zoom: 1, aspect }, uid });
}

const cards = [["0.30", card(0.30, "a")], ["0.38 (padrao)", card(0.38, "b")], ["0.50 (centro)", card(0.5, "c")]] as const;
const cardW = 240, cardH = Math.round(cardW * 1275 / 810), labelH = 26, gap = 24;
let inner = "";
cards.forEach(([label, svg], i) => {
  const png = new Resvg(svg, { font: { fontBuffers: [font], loadSystemFonts: false }, fitTo: { mode: "width", value: cardW * 2 } }).render().asPng();
  const u = `data:image/png;base64,${Buffer.from(png).toString("base64")}`;
  const x = i * (cardW + gap) + 10;
  inner += `<text x="${x + cardW / 2}" y="18" font-size="15" font-family="sans-serif" fill="#fff" text-anchor="middle">${label}</text>`;
  inner += `<image href="${u}" x="${x}" y="${labelH}" width="${cardW}" height="${cardH}"/>`;
});
const W = cards.length * (cardW + gap) + 10, H = cardH + labelH + 16;
writeFileSync("verify-crop.png", new Resvg(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="#2b2440"/>${inner}</svg>`, { fitTo: { mode: "width", value: W } }).render().asPng());
console.log("ok", w + "x" + h, "aspect", aspect.toFixed(3));
