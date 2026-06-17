import { readFileSync, writeFileSync } from "node:fs";
const dir = "C:/Users/thorz/Downloads/Cartas SVG";
const colors = ["red", "yellow", "blue", "green"];
const map: Record<number, string> = {};
for (let i = 1; i <= 40; i++) {
  const v = Math.floor((i - 1) / 4);
  map[i] = `${v}-${colors[(i - 1) % 4]}`;
}
const actions = ["draw2", "reverse", "skip"];
for (let a = 0; a < 3; a++)
  for (let c = 0; c < 4; c++) map[41 + a * 4 + c] = `${actions[a]}-${colors[c]}`;
map[53] = "wild";
map[54] = "wild4";
map[55] = "back";

let n = 0;
for (let i = 1; i <= 55; i++) {
  const svg = readFileSync(`${dir}/${i}.svg`, "utf8");
  writeFileSync(`public/cards/${map[i]}.svg`, svg);
  n++;
}
console.log("replaced", n, "cards");
console.log(JSON.stringify(map));
