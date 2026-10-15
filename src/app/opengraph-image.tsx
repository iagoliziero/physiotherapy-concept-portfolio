import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = site.ogTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagem de compartilhamento (Open Graph), gerada no build com a fonte dos títulos. */
export default async function OpenGraphImage() {
  // O gerador de imagem precisa do arquivo da fonte (TTF), não do WOFF2 do next/font
  const display = await readFile(join(process.cwd(), "src/app/fonts/BarlowCondensed-ExtraBold.ttf"));
  const line = { fontFamily: "Display", fontSize: 112, lineHeight: 0.95 } as const;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "56px 80px",
        background:
          "radial-gradient(circle at 15% 10%, rgba(45,212,191,.35), transparent 45%), radial-gradient(circle at 90% 90%, rgba(56,189,248,.3), transparent 45%), #0B1220",
        color: "#F8FAFC",
      }}
    >
      <div style={line}>FISIOTERAPIA</div>
      <div style={line}>QUE VAI ATÉ</div>
      <div style={line}>A SUA CASA</div>
      <div style={{ fontSize: 36, color: "#94A3B8", marginTop: 32 }}>{`${site.name}, fisioterapeuta`}</div>
    </div>,
    {
      ...size,
      fonts: [{ name: "Display", data: display, weight: 800, style: "normal" }],
    },
  );
}
