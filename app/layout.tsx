import type { Metadata } from "next";
import { Fraunces, Manrope, Baloo_2 } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const baloo = Baloo_2({
  subsets: ["latin"],
  variable: "--font-baloo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nosso UNO — o baralho de vocês dois",
  description:
    "Crie o seu UNO personalizado de casal com as suas fotos. Monte grátis, veja como fica e receba o PDF pronto pra imprimir.",
  openGraph: {
    title: "Nosso UNO — o baralho de vocês dois",
    description:
      "O UNO clássico, agora com as fotos de vocês em cada carta. Crie o seu em 2 minutos.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${manrope.variable} ${baloo.variable}`}
    >
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
