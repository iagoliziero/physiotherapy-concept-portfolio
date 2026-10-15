import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import type { ReactNode } from "react";
import { site } from "@/config/site";
import "lenis/dist/lenis.css";
import "@/styles/tokens.css";
import "@/styles/base.css";
import "@/styles/effects.css";
import "@/styles/sections.css";

// Fontes auto-hospedadas pelo next/font (sem requisição ao Google no navegador)
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

// Títulos: condensada e pesada, no estilo das capas dos Reels do Luis
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: site.ogTitle,
    description: site.ogDescription,
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: site.ogTitle,
    description: site.ogDescription,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: site.themeColor,
  colorScheme: "dark",
};

/** Sem JavaScript: mostra o conteúdo que normalmente entra com animação. */
const noScriptStyles = `
.word,.reveal,.step{opacity:1!important;transform:none!important;translate:none!important;filter:none!important}
.reveal-mask>span{translate:none!important}
[data-progress]{stroke-dashoffset:var(--done)!important}
`;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${barlowCondensed.variable}`}>
      <body>
        <noscript>
          <style>{noScriptStyles}</style>
        </noscript>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
