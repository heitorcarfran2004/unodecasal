"use client";

import { motion } from "motion/react";

function CompareCard({
  src,
  label,
  highlight = false,
}: {
  src: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 90, damping: 16 }}
      className="relative flex flex-col items-center gap-3"
    >
      {highlight && (
        <div
          className="pointer-events-none absolute -inset-6 -z-10 rounded-full opacity-70 blur-2xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(255,90,110,0.55), transparent)",
          }}
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={label}
        className={`w-[29vw] max-w-[185px] rounded-[12px] drop-shadow-[0_16px_26px_rgba(0,0,0,0.5)] sm:w-[158px] ${
          highlight ? "lg:w-[194px]" : "lg:w-[167px]"
        }`}
      />
      <figcaption
        className="text-sm font-bold"
        style={{ color: highlight ? "#ff6f93" : "#ffffff" }}
      >
        {label}
      </figcaption>
    </motion.figure>
  );
}

function Arrow() {
  return (
    <motion.svg
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.25 }}
      viewBox="0 0 24 24"
      className="h-auto w-7 shrink-0 text-blush sm:w-10"
      fill="none"
      stroke="currentColor"
      strokeWidth={3.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 12h14M13 6l6 6-6 6" />
    </motion.svg>
  );
}

export default function SameButYou() {
  return (
    <section
      className="relative overflow-hidden rounded-[32px] px-6 py-14 text-center text-white shadow-[0_30px_60px_-40px_rgba(0,0,0,0.7)] sm:px-10 sm:py-16"
      style={{ background: "#1b1612" }}
    >
      {/* subtle dot texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative mx-auto max-w-3xl">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          className="font-display text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl"
        >
          A mesma carta de sempre.
          <br />
          <span className="italic text-blush">Só que é vocês.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.08 }}
          className="mx-auto mt-4 max-w-md text-lg text-white/70"
        >
          É o UNO que vocês já sabem jogar — com a graça de ver a cara de vocês a
          cada rodada.
        </motion.p>

        <div className="mt-12 flex flex-row items-center justify-center gap-3 sm:gap-7 lg:gap-12">
          <CompareCard src="/compare/uno-normal.png" label="UNO normal" />
          <Arrow />
          <CompareCard src="/compare/voces.png" label="O de vocês ♥" highlight />
        </div>
      </div>
    </section>
  );
}
