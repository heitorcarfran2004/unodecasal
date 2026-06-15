/**
 * The real deck: user-supplied card art (public/cards/<key>.svg), each with a
 * transparent oval. We composite the couple photo *behind* the art so it shows
 * through the oval. The same composite is used for the web preview and the PDF.
 *
 * Card keys: numbers "0".."9" as `${n}-${color}`; actions `draw2|reverse|skip-${color}`;
 * plus `wild`, `wild4`, and `back` (the only card that carries the couple's names).
 */

export const COLORS = ["red", "yellow", "blue", "green"] as const;
export type Color = (typeof COLORS)[number];

/** Card body bounds inside the art's 810×1275 viewBox (for clipping the photo). */
export const CARD_BODY = { x: 44, y: 95, w: 700, h: 1084, r: 58 };

export function escapeXml(s: string): string {
  return s.replace(/[<>&'"]/g, (c) =>
    c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === "&" ? "&amp;" : c === "'" ? "&apos;" : "&quot;",
  );
}

/**
 * A photo placed on a card, with its framing inside the oval.
 * focalX/focalY (0..1): the point of the image aligned to the card centre.
 * zoom (>=1): scale on top of "cover". aspect: imgW/imgH.
 */
export interface CardPhoto {
  url: string;
  focalX: number;
  focalY: number;
  zoom: number;
  aspect: number;
}

/** Selfies put faces high — default focus on the upper third, not the centre. */
export const DEFAULT_FOCAL_Y = 0.4;

export function makePhoto(url: string, aspect: number): CardPhoto {
  return {
    url,
    focalX: 0.5,
    focalY: DEFAULT_FOCAL_Y,
    zoom: 1,
    aspect: aspect > 0 ? aspect : 0.75,
  };
}

function coverSize(aspect: number) {
  const { w, h } = CARD_BODY;
  const a = aspect > 0 ? aspect : 0.75;
  return a >= w / h
    ? { coverW: h * a, coverH: h }
    : { coverW: w, coverH: w / a };
}

/** Minimum zoom in the editor. The photo can be smaller than the card — a
 *  blurred copy fills behind it, so the oval is never empty. */
export const MIN_ZOOM = 0.6;
export function minZoom(_aspect?: number): number {
  return MIN_ZOOM;
}

/** Draw rect (viewBox units) of the sharp photo, from its focal point + zoom. */
export function photoDrawRect(photo: CardPhoto) {
  const { x, y, w, h } = CARD_BODY;
  const { coverW, coverH } = coverSize(photo.aspect);
  const z = Math.max(MIN_ZOOM, photo.zoom);
  const dw = coverW * z;
  const dh = coverH * z;
  const dx = x + w / 2 - photo.focalX * dw;
  const dy = y + h / 2 - photo.focalY * dh;
  return { dx, dy, dw, dh };
}

/** Compose a card: inject the photo behind the art (or the names on the back). */
export function compositeCard(
  rawSvg: string,
  opts: { key: string; photo?: CardPhoto; coupleName?: string; uid: string | number },
): string {
  const { key, photo, coupleName, uid } = opts;

  if (key === "back") {
    if (!coupleName) return rawSvg;
    const name = escapeXml(coupleName);
    const label = `<text x="405" y="1150" text-anchor="middle" fill="#ffffff" font-size="58" font-weight="700" font-style="italic" style="font-family:var(--font-baloo)">${name}</text>`;
    return rawSvg.replace(/(<\/svg>\s*)$/, `${label}$1`);
  }

  if (!photo) return rawSvg;
  const { x, y, w, h, r } = CARD_BODY;
  const { dx, dy, dw, dh } = photoDrawRect(photo);
  const f = (n: number) => Math.round(n * 100) / 100;
  const id = String(uid).replace(/[^a-z0-9]/gi, "");
  const clip = `pc-${id}`;
  const filt = `pb-${id}`;
  // Blur the fill only when zoomed out (where a real gap shows). At normal zoom
  // the plain cover fill is invisible behind the sharp photo — and skipping the
  // SVG filter keeps the deck/grid fast.
  const blur = photo.zoom < 0.95;
  const layer =
    `<defs>` +
    `<clipPath id="${clip}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ry="${r}"/></clipPath>` +
    (blur
      ? `<filter id="${filt}" x="-25%" y="-25%" width="150%" height="150%"><feGaussianBlur stdDeviation="26"/></filter>`
      : "") +
    `</defs>` +
    `<g clip-path="url(#${clip})">` +
    `<image href="${photo.url}" xlink:href="${photo.url}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"${blur ? ` filter="url(#${filt})"` : ""}/>` +
    `<image href="${photo.url}" xlink:href="${photo.url}" x="${f(dx)}" y="${f(dy)}" width="${f(dw)}" height="${f(dh)}" preserveAspectRatio="none"/>` +
    `</g>`;
  return rawSvg.replace(/(<svg[^>]*?>)/, `$1${layer}`);
}

/** Cards shown in the preview fan (last one is the back, which carries the names). */
export const PREVIEW_FAN_KEYS = [
  "0-red",
  "draw2-yellow",
  "skip-green",
  "7-blue",
  "wild4",
  "back",
] as const;

/** Curated cards for the shuffle→fan reveal: all colours + a mix of types + back. */
export const SHOWCASE_KEYS = [
  "0-red",
  "draw2-yellow",
  "4-blue",
  "skip-green",
  "9-red",
  "7-blue",
  "wild4",
  "back",
] as const;

/** All 54 distinct card faces (no back), for the "ver todas" grid. */
export const UNIQUE_FACES: string[] = (() => {
  const faces: string[] = [];
  for (const c of COLORS) {
    for (let n = 0; n <= 9; n++) faces.push(`${n}-${c}`);
    for (const t of ["draw2", "reverse", "skip"]) faces.push(`${t}-${c}`);
  }
  faces.push("wild", "wild4");
  return faces;
})();

/** Full playable deck composition (108 cards) for the print PDF. */
export function buildFullDeck(): string[] {
  const keys: string[] = [];
  for (const c of COLORS) {
    keys.push(`0-${c}`); // one 0 per colour
    for (let n = 1; n <= 9; n++) {
      keys.push(`${n}-${c}`, `${n}-${c}`); // two of 1..9
    }
    for (const t of ["draw2", "reverse", "skip"]) {
      keys.push(`${t}-${c}`, `${t}-${c}`); // two each
    }
  }
  for (let i = 0; i < 4; i++) keys.push("wild");
  for (let i = 0; i < 4; i++) keys.push("wild4");
  return keys; // 108
}

/**
 * Photo distribution: like a real UNO deck distinguishes cards by COLOUR, this
 * deck distinguishes them by PHOTO. So a photo is tied to the card's value/type
 * and is shared across the four colours (0-red = 0-yellow = 0-blue = 0-green).
 * Slots: 0..9 numbers, 10 skip, 11 reverse, 12 draw2, 13 wild, 14 wild4.
 */
export const PHOTO_SLOTS = 15;
const SLOT_COLORS = ["red", "yellow", "blue", "green"] as const;

export function photoSlot(key: string): number {
  if (key === "wild") return 13;
  if (key === "wild4") return 14;
  const type = key.split("-")[0];
  const n = Number(type);
  if (!Number.isNaN(n)) return n; // 0..9
  if (type === "skip") return 10;
  if (type === "reverse") return 11;
  if (type === "draw2") return 12;
  return 0;
}

/** A representative card key for a slot (used by the upload/adjust gallery). */
export function slotCardKey(slot: number): string {
  const c = SLOT_COLORS[slot % SLOT_COLORS.length];
  if (slot <= 9) return `${slot}-${c}`;
  if (slot === 10) return `skip-${c}`;
  if (slot === 11) return `reverse-${c}`;
  if (slot === 12) return `draw2-${c}`;
  if (slot === 13) return "wild";
  return "wild4";
}

/** The photo for a given card (same across colours; the back carries no photo). */
export function photoForCard(
  photos: CardPhoto[],
  key: string,
): CardPhoto | undefined {
  if (!photos.length || key === "back") return undefined;
  return photos[photoSlot(key) % photos.length];
}
