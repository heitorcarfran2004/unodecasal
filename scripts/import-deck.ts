import { readFileSync, writeFileSync } from "node:fs";
const CU = "C:/Users/thorz/Downloads/Cartas Uno";
const F4 = "C:/Users/thorz/Downloads/1 (1)";
const colors = ["red", "yellow", "blue", "green"];

type M = { src: string; file: string; key: string };
const map: M[] = [];

// numbers present in CU (1..36): values 0,1,2,3,5,6,7,8,9 (NO 4)
const cuNumbers = [0, 1, 2, 3, 5, 6, 7, 8, 9];
cuNumbers.forEach((v, bi) =>
  colors.forEach((c, ci) =>
    map.push({ src: CU, file: `${bi * 4 + ci + 1}.svg`, key: `${v}-${c}` }),
  ),
);
// value 4 from F4 (17..20)
colors.forEach((c, ci) => map.push({ src: F4, file: `${17 + ci}.svg`, key: `4-${c}` }));
// actions in CU: draw2 37-40, reverse 41-44, skip 45-48
["draw2", "reverse", "skip"].forEach((t, ti) =>
  colors.forEach((c, ci) =>
    map.push({ src: CU, file: `${37 + ti * 4 + ci}.svg`, key: `${t}-${c}` }),
  ),
);
map.push({ src: CU, file: "49.svg", key: "wild" });
map.push({ src: CU, file: "50.svg", key: "wild4" });
map.push({ src: CU, file: "51.svg", key: "back" });

for (const m of map) {
  const svg = readFileSync(`${m.src}/${m.file}`, "utf8");
  writeFileSync(`public/cards/${m.key}.svg`, svg);
}
console.log("imported", map.length, "cards");
