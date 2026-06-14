"use client";

import { useEffect, useId, useState, type CSSProperties } from "react";
import { compositeCard } from "@/lib/deck";

const cache = new Map<string, string>();

interface UnoCardProps {
  /** Deck key, e.g. "0-red", "skip-green", "wild4", "back". */
  cardKey: string;
  photoUrl?: string;
  coupleName?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Renders a real card from public/cards/<key>.svg (user's Canva art with a
 * transparent oval) and composites the couple photo behind it — same routine
 * used to build the print PDF, so preview === delivered product.
 */
export default function UnoCard({
  cardKey,
  photoUrl,
  coupleName,
  className = "",
  style,
}: UnoCardProps) {
  const uid = useId().replace(/[:]/g, "");
  const [raw, setRaw] = useState<string | null>(cache.get(cardKey) ?? null);

  useEffect(() => {
    if (cache.has(cardKey)) {
      setRaw(cache.get(cardKey)!);
      return;
    }
    let alive = true;
    fetch(`/cards/${cardKey}.svg`)
      .then((r) => r.text())
      .then((t) => {
        cache.set(cardKey, t);
        if (alive) setRaw(t);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [cardKey]);

  const svg = raw
    ? compositeCard(raw, { key: cardKey, photoHref: photoUrl, coupleName, uid })
    : null;

  const baseStyle: CSSProperties = {
    aspectRatio: "810 / 1275",
    fontFamily: "var(--font-baloo)",
    ...style,
  };

  if (!svg) {
    return (
      <div className={`uno-card relative ${className}`} style={baseStyle}>
        <div className="h-full w-full animate-pulse rounded-[7%] bg-black/10" />
      </div>
    );
  }

  return (
    <div
      className={`uno-card relative ${className}`}
      style={baseStyle}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
