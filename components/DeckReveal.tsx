"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import UnoCard from "./UnoCard";
import { SHOWCASE_KEYS, UNIQUE_FACES, photoForIndex } from "@/lib/deck";

interface DeckRevealProps {
  photos: string[];
  coupleName?: string;
  /** Go back to re-pick photos. */
  onRedo?: () => void;
}

/**
 * Final-step showcase: a stack of backs shuffles, then fans out while the
 * couple's photos cross-fade in. A "ver todas" toggle reveals the full grid.
 * Mobile-first; honours prefers-reduced-motion (skips straight to the fan).
 */
export default function DeckReveal({ photos, coupleName, onRedo }: DeckRevealProps) {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const [cardW, setCardW] = useState(120);
  const [open, setOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Fit card size to the available width (mobile-first).
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setCardW(Math.max(84, Math.min(140, el.clientWidth / 4.4)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Shuffle → open sequence (instant when reduced motion is on).
  useEffect(() => {
    if (reduce) {
      setOpen(true);
      return;
    }
    setOpen(false);
    const t = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(t);
  }, [reduce]);

  const keys = SHOWCASE_KEYS;
  const n = keys.length;
  const mid = (n - 1) / 2;
  const stepX = cardW * 0.4;
  const cardH = (cardW * 1275) / 810;
  const stageH = cardH + cardW * 0.5;

  return (
    <div>
      <div
        ref={stageRef}
        className="relative mx-auto w-full"
        style={{ height: stageH }}
      >
        {keys.map((key, i) => {
          const offset = i - mid;
          const fanX = offset * stepX;
          const fanY = Math.abs(offset) * (cardW * 0.05);
          const fanRot = offset * 6;
          const jX = (i % 2 ? 1 : -1) * (1 + (i % 3));
          const jRot = (i % 2 ? -1 : 1) * (2 + (i % 4));
          const photo = key === "back" ? undefined : photoForIndex(photos, i);
          const revealDelay = 0.06 * i;

          return (
            <motion.div
              key={`${key}-${i}`}
              className="absolute left-1/2 top-2"
              style={{ width: cardW, marginLeft: -cardW / 2, zIndex: i }}
              initial={reduce ? false : { x: 0, y: 0, rotate: jRot, opacity: 0 }}
              animate={
                open
                  ? { x: fanX, y: fanY, rotate: fanRot, opacity: 1 }
                  : { x: jX, y: 0, rotate: jRot, opacity: 1 }
              }
              transition={
                open
                  ? { delay: revealDelay, type: "spring", stiffness: 110, damping: 13 }
                  : {
                      x: { repeat: Infinity, repeatType: "mirror", duration: 0.16 + (i % 3) * 0.03 },
                      rotate: { repeat: Infinity, repeatType: "mirror", duration: 0.22 },
                      opacity: { duration: 0.2 },
                    }
              }
            >
              {/* front face (couple photo) — sits underneath */}
              <UnoCard cardKey={key} photoUrl={photo} coupleName={coupleName} />
              {/* back face on top, fades out to reveal the front */}
              <motion.div
                className="absolute inset-0"
                initial={reduce ? false : { opacity: 1 }}
                animate={{ opacity: open ? 0 : 1 }}
                transition={{ delay: open ? revealDelay + 0.12 : 0, duration: 0.4 }}
                style={{ pointerEvents: "none" }}
              >
                <UnoCard cardKey="back" />
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-col items-center gap-3">
        <button
          onClick={() => setShowAll((s) => !s)}
          className="rounded-full bg-white/15 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/25"
        >
          {showAll ? "Esconder as cartas" : "Ver todas as 108 cartas"}
        </button>
        {onRedo && (
          <button
            onClick={onRedo}
            className="text-sm font-semibold text-white/70 underline-offset-4 transition hover:text-white hover:underline"
          >
            ↻ refazer com outras fotos
          </button>
        )}
      </div>

      {showAll && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-6 grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-9"
        >
          {UNIQUE_FACES.map((key, i) => (
            <div key={key} className="card-lazy">
              <UnoCard cardKey={key} photoUrl={photoForIndex(photos, i)} />
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
