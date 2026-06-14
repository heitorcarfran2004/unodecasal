"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

interface CardFanProps {
  /** Image sources to fan out, left to right. */
  images: string[];
  /** Upper bound for a single card's width (px). */
  maxCardWidth?: number;
}

export default function CardFan({ images, maxCardWidth = 138 }: CardFanProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [cardW, setCardW] = useState(110);

  const n = images.length;
  const mid = (n - 1) / 2;
  const spread = 10; // degrees between cards
  const stepFactor = 0.36; // horizontal overlap (smaller = more closed)
  const spanFactor = (n - 1) * stepFactor + 1.85;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setCardW(Math.max(74, Math.min(maxCardWidth, el.clientWidth / spanFactor)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [spanFactor, maxCardWidth]);

  const cardH = (cardW * 1680) / 1080;
  const stepX = cardW * stepFactor;

  return (
    <div
      ref={ref}
      className="relative w-full"
      style={{ height: cardH * 1.16 + cardW * 0.22 }}
    >
      {images.map((src, i) => {
        const offset = i - mid;
        const rotate = offset * spread;
        const x = offset * stepX;
        const y = Math.abs(offset) * (cardW * 0.05);

        return (
          <div
            key={src}
            className="absolute left-1/2 top-1 origin-bottom"
            style={{
              width: cardW,
              marginLeft: -cardW / 2,
              zIndex: i,
              transform: `translateX(${x}px) translateY(${y}px) rotate(${rotate}deg)`,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.1 * i,
                type: "spring",
                stiffness: 130,
                damping: 15,
              }}
              whileHover={{ y: -20, scale: 1.04 }}
              className="cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                draggable={false}
                className="block w-full rounded-[9px] drop-shadow-[0_14px_24px_rgba(0,0,0,0.4)]"
              />
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
