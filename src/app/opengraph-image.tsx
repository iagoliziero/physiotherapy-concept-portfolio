import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = site.ogTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagem de compartilhamento (Open Graph), gerada no build. */
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background: "radial-gradient(circle at 15% 10%, rgba(45,212,191,.35), transparent 45%), radial-gradient(circle at 90% 90%, rgba(56,189,248,.3), transparent 45%), #0B1220",
        color: "#F8FAFC",
      }}
    >
      <div style={{ fontSize: 28, color: "#2DD4BF", letterSpacing: 2 }}>{"// FISIOTERAPIA EM DOMICÍLIO"}</div>
      <div style={{ fontSize: 92, lineHeight: 1.05, marginTop: 24 }}>Movimento sem dor</div>
      <div
        style={{
          fontSize: 92,
          lineHeight: 1.05,
          backgroundImage: "linear-gradient(90deg, #2DD4BF, #38BDF8, #A78BFA)",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        começa aqui
      </div>
      <div style={{ fontSize: 32, color: "#94A3B8", marginTop: 40 }}>
        {[site.name, site.address.city].filter(Boolean).join(" · ")}
      </div>
    </div>,
    size,
  );
}
