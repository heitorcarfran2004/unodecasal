import { photoForCard, photoSlot, PHOTO_SLOTS, slotCardKey } from "../lib/deck";
const photos = Array.from({ length: PHOTO_SLOTS }, (_, i) => ({
  url: `P${i}`, focalX: 0.5, focalY: 0.4, zoom: 1, aspect: 0.75,
}));
const test = ["0-red","0-yellow","0-blue","0-green","1-red","1-green","skip-red","skip-blue","reverse-yellow","draw2-red","draw2-green","wild","wild4","back"];
for (const k of test) {
  const p = photoForCard(photos, k);
  console.log(k.padEnd(14), "slot", String(photoSlot(k)).padEnd(2), "->", p ? p.url : "(none)");
}
console.log("PHOTO_SLOTS", PHOTO_SLOTS);
console.log("slot cards:", Array.from({length:PHOTO_SLOTS},(_,i)=>slotCardKey(i)).join(" "));
