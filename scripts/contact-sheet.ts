import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync } from "node:fs";

const dir = "C:/Users/thorz/Downloads/Cartas Uno";
const cols = 8;
const cellW = 150, cardW = 130, cardH = Math.round(cardW * 1275 / 810), labelH = 22;
const cellH = cardH + labelH;
const N = 51;
const rows = Math.ceil(N / cols);

let cells = "";
for (let i = 1; i <= N; i++) {
  const svg = readFileSync(`${dir}/${i}.svg`, "utf8");
  // rasterize each card individually (avoids id collisions), on transparent bg
  const png = new Resvg(svg, { fitTo: { mode: "width", value: cardW * 2 } }).render().asPng();
  const uri = `data:image/png;base64,${Buffer.from(png).toString("base64")}`;
  const c = (i - 1) % cols, r = Math.floor((i - 1) / cols);
  const x = c * cellW + 10, y = r * cellH + 10;
  cells += `<text x="${x + cardW/2}" y="${y + 15}" font-size="15" font-family="sans-serif" font-weight="bold" fill="#fff" text-anchor="middle">${i}</text>`;
  cells += `<image href="${uri}" x="${x}" y="${y + labelH}" width="${cardW}" height="${cardH}"/>`;
}
const W = cols * cellW + 20, H = rows * cellH + 20;
const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="#2b2440"/>${cells}</svg>`;
writeFileSync("contact-sheet.png", new Resvg(sheet, { fitTo: { mode: "width", value: W } }).render().asPng());
console.log("wrote contact-sheet.png", W, "x", H);
