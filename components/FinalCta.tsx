"use client";

import { motion } from "motion/react";

export default function FinalCta({ onStart }: { onStart: () => void }) {
  return (
    <section className="mx-auto w-full max-w-2xl">
      <div className="text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          className="font-display text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl"
        >
          Bora montar o <span className="italic text-blush">UNO de vocês</span>?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.08 }}
          className="mx-auto mt-4 max-w-md text-lg text-ink-soft"
        >
          Monte grátis e veja como fica antes de decidir — leva uns 2 minutinhos.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.16 }}
          onClick={onStart}
          className="group mt-8 inline-flex items-center gap-3 rounded-full bg-blush-deep px-9 py-4 text-base font-bold text-white shadow-[0_16px_34px_-12px_rgba(226,58,85,0.8)] transition hover:-translate-y-0.5 hover:bg-ink"
        >
          Criar o nosso UNO
          <span className="transition group-hover:translate-x-1">→</span>
        </motion.button>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-medium text-ink-soft">
          <span>⚡ PDF na hora</span>
          <span>✂️ é só imprimir</span>
          <span>♥ feito pra vocês</span>
        </div>
      </div>

      <footer className="mt-16 border-t border-ink/10 pt-6 text-center text-sm text-ink-soft">
        Nosso UNO — o baralho de vocês dois ♥
      </footer>
    </section>
  );
}
