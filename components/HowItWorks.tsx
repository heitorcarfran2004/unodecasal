"use client";

import { motion } from "motion/react";

interface Step {
  hex: string;
  tint: string;
  n: string;
  badge: string;
  title: string;
  text: string;
}

const STEPS: Step[] = [
  {
    hex: "var(--uno-red)",
    tint: "#fbe8e6",
    n: "1",
    badge: "≈ 2 min",
    title: "Escolham as fotos",
    text: "As melhores de vocês juntos — selfie, viagem, rolê. Vão entrando uma em cada carta.",
  },
  {
    hex: "var(--uno-blue)",
    tint: "#e8eef6",
    n: "2",
    badge: "Por nossa conta",
    title: "A gente monta o baralho",
    text: "108 cartas com a cara de vocês, mais a caixinha personalizada com os nomes.",
  },
  {
    hex: "var(--uno-green)",
    tint: "#e7f1ea",
    n: "3",
    badge: "Na hora",
    title: "Recebam o PDF e joguem",
    text: "PDF em alta, pronto pra imprimir. Joguem em casa ou deem de presente.",
  },
];

function MiniCard({ hex, n }: { hex: string; n: string }) {
  return (
    <div
      className="relative shrink-0 -rotate-6 overflow-hidden rounded-[9px] shadow-[0_7px_15px_-7px_rgba(0,0,0,0.45)] ring-2 ring-white"
      style={{ width: 42 }}
    >
      <svg
        viewBox="0 0 63 88"
        className="block w-full"
        style={{ fontFamily: "var(--font-baloo)" }}
      >
        <rect width="63" height="88" rx="9" fill={hex} />
        {/* diagonal white oval */}
        <ellipse
          cx="31.5"
          cy="44"
          rx="23"
          ry="38"
          transform="rotate(35 31.5 44)"
          fill="#ffffff"
        />
        <text
          x="31.5"
          y="47"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="34"
          fontWeight="800"
          fontStyle="italic"
          fill={hex}
        >
          {n}
        </text>
        <text x="8.5" y="18" textAnchor="middle" fontSize="14" fontWeight="800" fontStyle="italic" fill="#ffffff">
          {n}
        </text>
        <text
          x="54.5"
          y="74"
          textAnchor="middle"
          fontSize="14"
          fontWeight="800"
          fontStyle="italic"
          fill="#ffffff"
          transform="rotate(180 54.5 70)"
        >
          {n}
        </text>
      </svg>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section className="mx-auto w-full max-w-5xl text-center">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        className="text-xs font-bold uppercase tracking-[0.22em] text-blush"
      >
        Simples assim
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ delay: 0.05 }}
        className="font-display mt-3 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl"
      >
        Do clique ao jogo em 3 passos
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ delay: 0.1 }}
        className="mx-auto mt-4 max-w-xl text-lg text-ink-soft"
      >
        Sem app, sem espera. Vocês montam, a gente entrega o PDF, vocês imprimem.
      </motion.p>

      <div className="relative mt-12">
        {/* dashed connector behind the cards (desktop only) */}
        <div className="absolute inset-x-[16%] top-[118px] hidden border-t-2 border-dashed border-ink/15 lg:block" />

        <div className="grid gap-5 lg:grid-cols-3">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: 0.12 * i, type: "spring", stiffness: 90, damping: 16 }}
              className="relative z-10 rounded-[28px] p-6 text-left shadow-[0_20px_40px_-28px_rgba(33,27,23,0.5)] sm:p-7"
              style={{ background: s.tint }}
            >
              <div className="flex items-start justify-between gap-3">
                <MiniCard hex={s.hex} n={s.n} />
                <span
                  className="rounded-full border bg-paper/60 px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
                  style={{ borderColor: s.hex, color: s.hex }}
                >
                  {s.badge}
                </span>
              </div>

              <h3 className="mt-6 flex items-center gap-2 text-lg font-extrabold text-ink">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ background: s.hex }}
                />
                {s.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                {s.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
