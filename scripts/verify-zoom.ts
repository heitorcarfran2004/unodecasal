import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync } from "node:fs";
import { compositeCard, minZoom } from "../lib/deck";

function jpegSize(buf: Buffer) {
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) { i++; continue; }
    const m = buf[i + 1];
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc)
      return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return { w: 700, h: 1050 };
}

const buf = readFileSync("assets/test-photo.jpg");
const { w, h } = jpegSize(buf);
const aspect = w / h;
const uri = `data:image/jpeg;base64,${buf.toString("base64")}`;
const art = readFileSync("public/cards/7-blue.svg", "utf8");
const mz = minZoom(aspect);

function card(zoom: number, uid: string) {
  // inject magenta bg first to reveal any uncovered oval area
  const svg = compositeCard(art, { key: "7-blue", photo: { url: uri, focalX: 0.5, focalY: 0.4, zoom, aspect }, uid });
  return svg.replace(/(<svg[^>]*?>)/, `$1<rect x="44" y="95" width="700" height="1084" rx="58" fill="#ff00ff"/>`);
}

const items = [[`min (${mz.toFixed(2)})`, card(mz, "a")], ["1.0", card(1, "b")], ["1.6", card(1.6, "c")]] as const;
const cardW = 220, cardH = Math.round(cardW * 1275 / 810), labelH = 24, gap = 20;
let inner = "";
items.forEach(([label, svg], i) => {
  const png = new Resvg(svg, { fitTo: { mode: "width", value: cardW * 2 } }).render().asPng();
  const u = `data:image/png;base64,${Buffer.from(png).toString("base64")}`;
  const x = i * (cardW + gap) + 10;
  inner += `<text x="${x + cardW / 2}" y="17" font-size="15" font-family="sans-serif" fill="#fff" text-anchor="middle">zoom ${label}</text>`;
  inner += `<image href="${u}" x="${x}" y="${labelH}" width="${cardW}" height="${cardH}"/>`;
});
const W = items.length * (cardW + gap) + 10, H = cardH + labelH + 14;
writeFileSync("verify-zoom.png", new Resvg(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="#2b2440"/>${inner}</svg>`, { fitTo: { mode: "width", value: W } }).render().asPng());
console.log("ok minZoom=" + mz.toFixed(3));
