"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import UnoCard from "./UnoCard";
import {
  CARD_BODY,
  minZoom,
  photoDrawRect,
  slotCardKey,
  type CardPhoto,
} from "@/lib/deck";

const VB_W = 810;
const VB_H = 1268; // matches the card art's real viewBox height

// Clip the photo to the card body (rounded rect), so it doesn't bleed past the
// card edge into the art's transparent margin.
const BODY_CLIP = `inset(${((CARD_BODY.y / VB_H) * 100).toFixed(2)}% ${(((VB_W - CARD_BODY.x - CARD_BODY.w) / VB_W) * 100).toFixed(2)}% ${(((VB_H - CARD_BODY.y - CARD_BODY.h) / VB_H) * 100).toFixed(2)}% ${((CARD_BODY.x / VB_W) * 100).toFixed(2)}% round ${((CARD_BODY.r / VB_W) * 100).toFixed(2)}%)`;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export default function AdjustStep({
  photos,
  onChange,
  onBack,
  onNext,
}: {
  photos: CardPhoto[];
  onChange: (updater: (prev: CardPhoto[]) => CardPhoto[]) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const [editing, setEditing] = useState<number | null>(null);

  return (
    <div className="flex flex-1 flex-col">
      <div className="max-w-2xl">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-blush">
          Etapa 2 de 3
        </span>
        <h2 className="font-display mt-2 text-4xl font-black leading-tight sm:text-5xl">
          Ajeitem o rosto no oval
        </h2>
        <p className="mt-3 text-lg text-ink-soft">
          A gente já posicionou pra vocês. Quer mexer? Toque numa carta pra
          arrastar e dar zoom — ou é só prosseguir.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {photos.map((p, i) => (
          <button
            key={i}
            onClick={() => setEditing(i)}
            className="group relative transition hover:-translate-y-0.5"
          >
            <UnoCard cardKey={slotCardKey(i)} photo={p} />
            <span className="absolute inset-x-0 bottom-2 mx-auto flex w-fit items-center gap-1 rounded-full bg-ink/80 px-3.5 py-1.5 text-[13px] font-bold text-white shadow-md backdrop-blur transition group-hover:bg-blush-deep">
              ✎ ajustar
            </span>
          </button>
        ))}
      </div>

      <div className="mt-auto flex flex-col items-stretch gap-3 pt-10">
        <span className="mx-auto max-w-md rounded-2xl bg-blush/10 px-4 py-2.5 text-center text-[15px] font-semibold text-ink">
          Pode prosseguir — dá pra deixar como está ou ajustar do seu jeito ❤️
        </span>
        <button
          onClick={onNext}
          className="w-full rounded-full bg-uno-green py-4 text-base font-bold text-white shadow-[0_16px_34px_-12px_rgba(22,164,76,0.7)] transition hover:-translate-y-0.5 hover:brightness-110"
        >
          Continuar →
        </button>
        <button
          onClick={onBack}
          className="w-full rounded-full border-2 border-ink bg-transparent py-3.5 text-base font-bold text-ink transition hover:bg-ink/5"
        >
          ← Voltar
        </button>
      </div>

      <AnimatePresence>
        {editing !== null && photos[editing] && (
          <PhotoEditor
            key={editing}
            photo={photos[editing]}
            cardKey={slotCardKey(editing)}
            index={editing}
            total={photos.length}
            onClose={() => setEditing(null)}
            onApply={(patch) => {
              const idx = editing;
              onChange((prev) =>
                prev.map((p, i) => (i === idx ? { ...p, ...patch } : p)),
              );
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function PhotoEditor({
  photo,
  cardKey,
  index,
  total,
  onClose,
  onApply,
}: {
  photo: CardPhoto;
  cardKey: string;
  index: number;
  total: number;
  onClose: () => void;
  onApply: (patch: Partial<CardPhoto>) => void;
}) {
  const [focalX, setFocalX] = useState(photo.focalX);
  const [focalY, setFocalY] = useState(photo.focalY);
  const [zoom, setZoom] = useState(photo.zoom);
  const boxRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; fx: number; fy: number } | null>(
    null,
  );

  const rect = photoDrawRect({ ...photo, focalX, focalY, zoom });

  const onDown = (e: React.PointerEvent) => {
    boxRef.current?.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, fx: focalX, fy: focalY };
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current || !boxRef.current) return;
    const b = boxRef.current.getBoundingClientRect();
    const scale = b.width / VB_W;
    const r = photoDrawRect({ ...photo, focalX: 0.5, focalY: 0.5, zoom });
    const dxpx = e.clientX - drag.current.x;
    const dypx = e.clientY - drag.current.y;
    setFocalX(clamp(drag.current.fx - dxpx / scale / r.dw, 0, 1));
    setFocalY(clamp(drag.current.fy - dypx / scale / r.dh, 0, 1));
  };
  const onUp = () => {
    drag.current = null;
  };

  const apply = () => {
    onApply({ focalX, focalY, zoom });
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink/85 p-5 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="w-full max-w-xs" onClick={(e) => e.stopPropagation()}>
        <p className="mb-3 text-center text-base font-semibold text-white/80">
          Arraste pra posicionar · ajuste o zoom
        </p>
        <div
          ref={boxRef}
          className="relative mx-auto w-[240px] max-w-full cursor-grab touch-none select-none overflow-hidden rounded-[7%] active:cursor-grabbing"
          style={{ aspectRatio: `${VB_W} / ${VB_H}` }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          {/* photo layers clipped to the card body (no bleed past the edge) */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ clipPath: BODY_CLIP }}
          >
            {/* blurred fill behind, so the oval is never empty when zoomed out */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt=""
              draggable={false}
              className="absolute inset-0 h-full w-full object-cover"
              style={{ filter: "blur(7px)", transform: "scale(1.12)" }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt=""
              draggable={false}
              style={{
                position: "absolute",
                left: `${(rect.dx / VB_W) * 100}%`,
                top: `${(rect.dy / VB_H) * 100}%`,
                width: `${(rect.dw / VB_W) * 100}%`,
                height: `${(rect.dh / VB_H) * 100}%`,
                maxWidth: "none",
              }}
            />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/cards/${cardKey}.svg`}
            alt=""
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full"
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <span className="text-2xl font-bold leading-none text-white">−</span>
          <input
            type="range"
            min={minZoom(photo.aspect)}
            max={2.1}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full accent-blush"
            aria-label="Zoom"
          />
          <span className="text-2xl font-bold leading-none text-white">+</span>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border-2 border-white/40 py-3 text-sm font-bold text-white transition hover:bg-white/10"
          >
            Cancelar
          </button>
          <button
            onClick={apply}
            className="flex-1 rounded-full bg-uno-green py-3 text-sm font-bold text-white transition hover:brightness-110"
          >
            Pronto
          </button>
        </div>
        <p className="mt-3 text-center text-xs text-white/50">
          Foto {index + 1} de {total}
        </p>
      </div>
    </motion.div>
  );
}
