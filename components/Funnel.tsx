"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import CardFan from "./CardFan";
import DeckReveal from "./DeckReveal";
import FinalCta from "./FinalCta";
import HowItWorks from "./HowItWorks";
import SameButYou from "./SameButYou";
import UnoCard from "./UnoCard";

const PRICE = "R$ 18,90";
const PHOTO_TARGET = 12;

interface FunnelData {
  photos: string[];
  name1: string;
  name2: string;
  contactName: string;
  whatsapp: string;
  email: string;
}

const EMPTY: FunnelData = {
  photos: [],
  name1: "",
  name2: "",
  contactName: "",
  whatsapp: "",
  email: "",
};

const STEPS = ["Apresentação", "Suas fotos", "O casal", "Seu UNO"];

export default function Funnel() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FunnelData>(EMPTY);
  const patch = (p: Partial<FunnelData>) => setData((d) => ({ ...d, ...p }));

  const coupleName = useMemo(() => {
    const a = data.name1.trim();
    const b = data.name2.trim();
    if (a && b) return `${a} & ${b}`;
    return a || b || "";
  }, [data.name1, data.name2]);

  const go = (n: number) => {
    setStep(Math.max(0, Math.min(STEPS.length - 1, n)));
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 pb-16 pt-6 sm:px-8">
      {step > 0 && <Progress step={step} onJump={go} />}

      <AnimatePresence mode="wait">
        {step === 0 && (
          <StepShell key="intro">
            <IntroStep onStart={() => go(1)} />
          </StepShell>
        )}
        {step === 1 && (
          <StepShell key="upload">
            <UploadStep
              photos={data.photos}
              onChange={(photos) => patch({ photos })}
              onBack={() => go(0)}
              onNext={() => go(2)}
            />
          </StepShell>
        )}
        {step === 2 && (
          <StepShell key="couple">
            <CoupleStep
              data={data}
              patch={patch}
              onBack={() => go(1)}
              onNext={() => go(3)}
            />
          </StepShell>
        )}
        {step === 3 && (
          <StepShell key="preview">
            <PreviewStep
              photos={data.photos}
              coupleName={coupleName}
              onRedo={() => go(1)}
            />
          </StepShell>
        )}
      </AnimatePresence>
    </main>
  );
}

/* ----------------------------------------------------------------- shell */

function StepShell({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}

function Progress({
  step,
  onJump,
}: {
  step: number;
  onJump: (n: number) => void;
}) {
  return (
    <div className="mb-8 flex items-center justify-center gap-2 sm:gap-3">
      {STEPS.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <button
            key={label}
            onClick={() => i < step && onJump(i)}
            disabled={i >= step}
            className="group flex items-center gap-2"
          >
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition ${
                active
                  ? "bg-blush text-white"
                  : done
                    ? "bg-ink text-cream"
                    : "bg-ink/10 text-ink/40"
              }`}
            >
              {done ? "✓" : i + 1}
            </span>
            <span
              className={`hidden text-sm font-semibold sm:inline ${
                active ? "text-ink" : "text-ink/40"
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <span className="mx-1 hidden h-px w-6 bg-ink/15 sm:inline-block" />
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ intro */

function IntroStep({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col gap-24 pb-10 sm:gap-32">
      <div className="grid items-center gap-6 lg:min-h-[78vh] lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
      <div className="order-2 lg:order-1">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper/70 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-ink-soft"
        >
          <span className="text-blush">♥</span> Edição de casal
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="font-display mt-5 text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl"
        >
          O{" "}
          <span className="relative inline-block">
            <span className="relative z-10">UNO</span>
            <span className="absolute inset-x-0 bottom-1 z-0 h-4 -rotate-1 bg-uno-yellow/70" />
          </span>{" "}
          de vocês <span className="italic text-blush">dois</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft"
        >
          O baralho clássico que vocês amam — só que com as{" "}
          <strong className="text-ink">fotos do casal</strong> em cada carta.
          Monte o seu agora, <strong className="text-ink">de graça</strong>, e
          veja como fica antes de decidir.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          onClick={onStart}
          className="group mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-uno-green px-8 py-4 text-base font-bold text-white shadow-[0_18px_36px_-12px_rgba(22,164,76,0.75)] transition hover:-translate-y-0.5 hover:brightness-110"
        >
          Criar o nosso UNO
          <span className="transition group-hover:translate-x-1">→</span>
        </motion.button>

        <motion.ul
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08, delayChildren: 0.35 } },
          }}
          className="mt-6 grid grid-cols-3 gap-3"
        >
          {[
            ["📸", "Suas fotos em cada carta"],
            ["🃏", "108 cartas + a caixinha"],
            ["⚡", "Receba o PDF na hora"],
          ].map(([emoji, text]) => (
            <motion.li
              key={text}
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0 },
              }}
              className="flex flex-col items-center gap-2 rounded-2xl border border-ink/10 bg-paper/60 px-3 py-4 text-center text-sm font-semibold"
            >
              <span className="text-2xl">{emoji}</span>
              {text}
            </motion.li>
          ))}
        </motion.ul>
      </div>

      <div className="order-1 lg:order-2">
        <div className="animate-float-soft mx-auto mt-4 w-full max-w-[380px] lg:mt-0">
          <CardFan
            images={[
              "/hero/1.png",
              "/hero/2.png",
              "/hero/3.png",
              "/hero/4.png",
              "/hero/5.png",
              "/hero/6.png",
            ]}
          />
        </div>
      </div>
      </div>
      <HowItWorks />
      <SameButYou />
      <FinalCta onStart={onStart} />
    </div>
  );
}

/* ----------------------------------------------------------------- upload */

function UploadStep({
  photos,
  onChange,
  onBack,
  onNext,
}: {
  photos: string[];
  onChange: (p: string[]) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const urls = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((f) => URL.createObjectURL(f));
    onChange([...photos, ...urls].slice(0, PHOTO_TARGET));
  };

  const removeAt = (i: number) =>
    onChange(photos.filter((_, idx) => idx !== i));

  const slots = Array.from({ length: PHOTO_TARGET });

  return (
    <div className="flex flex-1 flex-col">
      <Header
        kicker="Etapa 1 de 3"
        title="Escolham 12 fotos de vocês"
        subtitle="Fotos juntinhos funcionam lindas no oval da carta. Pode ser selfie, viagem, rolê — vão entrando uma em cada carta."
      />

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => addFiles(e.target.files)}
      />

      <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {slots.map((_, i) => {
          const url = photos[i];
          if (url)
            return (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative aspect-square overflow-hidden rounded-2xl ring-2 ring-ink/10"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Foto ${i + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={() => removeAt(i)}
                  className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-ink/70 text-sm text-white opacity-0 backdrop-blur transition group-hover:opacity-100"
                  aria-label="Remover foto"
                >
                  ✕
                </button>
              </motion.div>
            );
          const isNext = i === photos.length;
          return (
            <button
              key={i}
              onClick={() => inputRef.current?.click()}
              className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed text-sm font-semibold transition ${
                isNext
                  ? "border-blush bg-blush/5 text-blush"
                  : "border-ink/15 text-ink/30 hover:border-ink/30"
              }`}
            >
              <span className="text-2xl leading-none">+</span>
              {isNext && <span className="text-xs">add foto</span>}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-center gap-3 text-sm font-semibold text-ink-soft">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink/10">
          <div
            className="h-full rounded-full bg-blush transition-all"
            style={{ width: `${(photos.length / PHOTO_TARGET) * 100}%` }}
          />
        </div>
        {photos.length}/{PHOTO_TARGET}
      </div>

      <NavRow
        onBack={onBack}
        onNext={onNext}
        nextDisabled={photos.length < 2}
        nextLabel={
          photos.length < PHOTO_TARGET
            ? `Continuar (${photos.length} foto${photos.length === 1 ? "" : "s"})`
            : "Continuar →"
        }
        hint="Escolham sem stress! As fotos e o acabamento a gente acerta junto depois ❤️"
      />
    </div>
  );
}

/* ----------------------------------------------------------------- couple */

function CoupleStep({
  data,
  patch,
  onBack,
  onNext,
}: {
  data: FunnelData;
  patch: (p: Partial<FunnelData>) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const ready =
    data.name1.trim() &&
    data.name2.trim() &&
    data.contactName.trim() &&
    (data.whatsapp.trim() || data.email.trim());

  return (
    <div className="flex flex-1 flex-col">
      <Header
        kicker="Etapa 2 de 3"
        title="Quem é o casal?"
        subtitle="Os nomes entram no verso das cartas. O contato é só pra te enviar o UNO pronto."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Nome de um"
              value={data.name1}
              onChange={(v) => patch({ name1: v })}
              placeholder="Ex: Vitor"
            />
            <Field
              label="Nome do outro"
              value={data.name2}
              onChange={(v) => patch({ name2: v })}
              placeholder="Ex: Lara"
            />
          </div>
          <Field
            label="Seu nome (quem está comprando)"
            value={data.contactName}
            onChange={(v) => patch({ contactName: v })}
            placeholder="Como te chamamos"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="WhatsApp"
              value={data.whatsapp}
              onChange={(v) => patch({ whatsapp: v })}
              placeholder="(00) 90000-0000"
            />
            <Field
              label="E-mail"
              value={data.email}
              onChange={(v) => patch({ email: v })}
              placeholder="voce@email.com"
            />
          </div>
          <p className="text-xs text-ink-soft">
            Pedimos o contato agora pra garantir que, mesmo que você feche a
            página, a gente consiga te mandar o seu UNO. 💌
          </p>
        </div>

        {/* live name preview on the wild card */}
        <div className="flex items-start justify-center">
          <div className="w-[180px]">
            <UnoCard
              cardKey="back"
              coupleName={
                data.name1 && data.name2
                  ? `${data.name1} & ${data.name2}`
                  : "Vocês dois"
              }
            />
            <p className="mt-3 text-center text-xs font-medium text-ink-soft">
              prévia do verso (com o nome de vocês)
            </p>
          </div>
        </div>
      </div>

      <NavRow
        onBack={onBack}
        onNext={onNext}
        nextDisabled={!ready}
        nextLabel="Ver o nosso UNO →"
        hint={!ready ? "Preencha os nomes e um contato" : undefined}
      />
    </div>
  );
}

/* ---------------------------------------------------------------- preview */

function PreviewStep({
  photos,
  coupleName,
  onRedo,
}: {
  photos: string[];
  coupleName: string;
  onRedo: () => void;
}) {
  const [ordered, setOrdered] = useState(false);

  const buyButton = (label: string) => (
    <button
      onClick={() => setOrdered(true)}
      className="group flex w-full items-center justify-center gap-2 rounded-full bg-uno-green py-4 text-base font-bold text-white shadow-[0_16px_34px_-12px_rgba(22,164,76,0.7)] transition hover:-translate-y-0.5 hover:brightness-110"
    >
      {label}
      <span className="transition group-hover:translate-x-1">→</span>
    </button>
  );

  const orderedBox = (
    <div className="rounded-2xl bg-uno-green/10 px-5 py-5 text-center">
      <p className="font-display text-xl font-bold text-uno-green">
        Pedido recebido! 🎉
      </p>
      <p className="mt-1 text-sm text-ink-soft">
        (demo) — aqui entra o checkout do ggCheckout e a geração automática do PDF.
      </p>
    </div>
  );

  const gets = [
    { hex: "var(--uno-red)", el: <><strong>108 cartas</strong> personalizadas com as fotos de vocês</> },
    { hex: "var(--uno-yellow)", el: <><strong>Caixinha</strong> com os nomes de vocês no verso</> },
    { hex: "var(--uno-green)", el: <><strong>PDF em alta resolução</strong> (300 DPI), pronto pra imprimir</> },
    { hex: "var(--uno-blue)", el: <>Imprime <strong>em casa ou em qualquer gráfica</strong> — quantas vezes quiser</> },
    { hex: "var(--uno-black)", el: <>Chega <strong>na hora</strong>, no seu e-mail e WhatsApp</> },
  ];

  const faqs: [string, string][] = [
    ["É físico ou digital?", "É digital: você recebe um PDF pronto pra imprimir. Não enviamos cartas físicas pelo correio."],
    ["Como eu recebo?", "Assim que o pagamento é confirmado, o link do PDF chega no seu e-mail e no WhatsApp — na hora."],
    ["Preciso de uma impressora boa?", "Não precisa. Dá pra imprimir em casa; pra durar mais, recomendamos papel mais grosso numa gráfica ou papelaria — sai baratinho."],
    ["Posso imprimir mais de uma vez?", "Pode! O PDF é de vocês pra sempre — imprimam quantas vezes quiserem."],
  ];

  return (
    <div className="flex flex-1 flex-col">
      {/* felt deck */}
      <div className="felt rounded-[32px] px-5 py-10 text-center text-white shadow-2xl sm:px-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs font-bold uppercase tracking-[0.25em] text-white/60"
        >
          {coupleName ? `${coupleName} —` : ""} olha que lindo ficou
        </motion.p>
        <h2 className="font-display mt-3 text-4xl font-black sm:text-5xl">
          O UNO de vocês está pronto ♥
        </h2>
        <div className="mt-10">
          <DeckReveal
            photos={photos}
            coupleName={coupleName || "Vocês dois"}
            onRedo={onRedo}
          />
        </div>
      </div>

      {/* what you get */}
      <section className="mx-auto mt-12 w-full max-w-lg rounded-3xl border border-ink/10 bg-paper px-6 py-7 shadow-xl">
        <h3 className="font-display text-2xl font-black">O que chega pra vocês</h3>
        <ul className="mt-5 space-y-4">
          {gets.map((g, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white"
                style={{ background: g.hex }}
              >
                ✓
              </span>
              <span className="text-[15px] leading-snug text-ink">{g.el}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* offer */}
      <div className="mx-auto mt-10 w-full max-w-lg rounded-3xl border border-ink/10 bg-paper px-6 py-8 text-center shadow-xl">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blush/30 bg-blush/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-blush-deep">
          🔥 Preço de lançamento
        </span>
        <p className="mt-4 text-base font-semibold text-ink-soft line-through">
          R$ 69,90
        </p>
        <p className="font-display text-[56px] font-black leading-none text-ink">
          {PRICE}
        </p>

        <div className="mt-6">{ordered ? orderedBox : buyButton("Quero o nosso UNO")}</div>

        <div className="mt-4 flex items-center justify-center gap-4 text-xs font-medium text-ink-soft">
          <span>🔒 Compra segura</span>
          <span>⚡ Acesso imediato</span>
        </div>
        <p className="mt-2 text-xs font-medium text-ink-soft">♥ Feito pra vocês</p>
      </div>

      {/* guarantee */}
      <div className="mx-auto mt-6 flex w-full max-w-lg items-start gap-3 rounded-2xl bg-uno-green/10 px-5 py-5">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-uno-green text-sm font-bold text-white">
          ✓
        </span>
        <p className="text-sm leading-relaxed text-ink">
          <strong>Garantia de satisfação.</strong> Não ficou do jeito que vocês
          sonharam? A gente ajusta sem custo — ou devolve seu dinheiro. Simples
          assim.
        </p>
      </div>

      {/* faq */}
      <section className="mx-auto mt-14 w-full max-w-lg">
        <h3 className="font-display text-center text-3xl font-black">
          Antes de fechar
        </h3>
        <div className="mt-6 space-y-3">
          {faqs.map(([q, a]) => (
            <FaqItem key={q} q={q} a={a} />
          ))}
        </div>
      </section>

      {/* closing buy */}
      <div className="mx-auto mt-10 w-full max-w-lg">
        {ordered ? orderedBox : buyButton("Quero o nosso UNO")}
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-ink/10 bg-paper/70">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-base font-bold text-ink"
      >
        {q}
        <span className="text-xl leading-none text-blush">
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <p className="px-5 pb-4 text-sm leading-relaxed text-ink-soft">{a}</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ bits */

function Header({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="max-w-2xl">
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-blush">
        {kicker}
      </span>
      <h2 className="font-display mt-2 text-4xl font-black leading-tight sm:text-5xl">
        {title}
      </h2>
      <p className="mt-3 text-lg text-ink-soft">{subtitle}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-ink/15 bg-paper px-4 py-3 text-base outline-none transition placeholder:text-ink/30 focus:border-blush focus:ring-4 focus:ring-blush/15"
      />
    </label>
  );
}

function NavRow({
  onBack,
  onNext,
  nextDisabled,
  nextLabel,
  hint,
}: {
  onBack: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel: string;
  hint?: string;
}) {
  return (
    <div className="mt-auto flex flex-col items-stretch gap-3 pt-10">
      {hint && (
        <span className="mx-auto max-w-md text-center text-sm font-medium text-ink-soft">
          {hint}
        </span>
      )}
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className="w-full rounded-full bg-uno-green py-4 text-base font-bold text-white shadow-[0_16px_34px_-12px_rgba(22,164,76,0.7)] transition enabled:hover:-translate-y-0.5 enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {nextLabel}
      </button>
      <button
        onClick={onBack}
        className="w-full rounded-full border-2 border-ink bg-transparent py-3.5 text-base font-bold text-ink transition hover:bg-ink/5"
      >
        ← Voltar
      </button>
    </div>
  );
}
