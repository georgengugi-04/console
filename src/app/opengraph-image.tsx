import { ImageResponse } from "next/og";
import { SHIELD_PATH, SWOOSH_PATH } from "@/components/brand/Logo";
import { company } from "@/content/company";

export const alt = `${company.name} — ${company.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social-sharing card, generated at build time from the same shield geometry as the logo. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 56,
          padding: "0 96px",
          background: "radial-gradient(900px 600px at 78% 30%, #0b2a7a 0%, #040a1c 55%, #02050d 100%)",
          color: "#f2f6ff",
        }}
      >
        <svg width="260" height="276" viewBox="0 0 104 110" fill="none">
          <defs>
            <linearGradient id="sw" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#1747d6" />
              <stop offset="0.55" stopColor="#2f86ff" />
              <stop offset="1" stopColor="#9ed0ff" />
            </linearGradient>
          </defs>
          <path d={SHIELD_PATH} stroke="#dbe6ff" strokeWidth="9" strokeLinejoin="miter" />
          <path d={SWOOSH_PATH} fill="url(#sw)" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, fontWeight: 800, letterSpacing: -2, lineHeight: 1 }}>CONSOLE</div>
          <div style={{ fontSize: 30, letterSpacing: 14, color: "#4da3ff", marginTop: 14 }}>INSURANCE</div>
          <div style={{ fontSize: 40, marginTop: 56, color: "#c6d4f5" }}>{company.tagline}</div>
        </div>
      </div>
    ),
    size,
  );
}
