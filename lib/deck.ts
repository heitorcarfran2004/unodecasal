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

/** Compose a card: inject the photo behind the art (or the names on the back). */
export function compositeCard(
  rawSvg: string,
  opts: { key: string; photoHref?: string; coupleName?: string; uid: string | number },
): string {
  const { key, photoHref, coupleName, uid } = opts;

  if (key === "back") {
    if (!coupleName) return rawSvg;
    const name = escapeXml(coupleName);
    const label = `<text x="405" y="1150" text-anchor="middle" fill="#ffffff" font-size="58" font-weight="700" font-style="italic" style="font-family:var(--font-baloo)">${name}</text>`;
    return rawSvg.replace(/(<\/svg>\s*)$/, `${label}$1`);
  }

  if (!photoHref) return rawSvg;
  const { x, y, w, h, r } = CARD_BODY;
  const clip = `pc-${String(uid).replace(/[^a-z0-9]/gi, "")}`;
  const layer =
    `<defs><clipPath id="${clip}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ry="${r}"/></clipPath></defs>` +
    `<image href="${photoHref}" xlink:href="${photoHref}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clip})"/>`;
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

/** Assign one of the uploaded photos to a card index (even cycle). */
export function photoForIndex(photos: string[], index: number): string | undefined {
  if (!photos.length) return undefined;
  return photos[index % photos.length];
}
