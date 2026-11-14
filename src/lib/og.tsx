import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

/** Branded 1200×630 social card: Klein Blue gradient, orange star, page title. */
export function brandOg(title: string, eyebrow = "Smart Solutions") {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "white",
          background: "radial-gradient(circle at 85% 15%, #011efd 0%, #1b08b7 45%, #12057f 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, fontWeight: 600 }}>
          <svg width="34" height="34" viewBox="0 0 24 24">
            <path d="M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0Z" fill="#ff7001" />
          </svg>
          {eyebrow}
        </div>
        <div style={{ fontSize: title.length > 60 ? 64 : 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em", maxWidth: 1000 }}>
          {title}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26, color: "rgba(255,255,255,0.8)" }}>
          <span>Smart Solutions · Powered by VASAY.AI · Concord, ON</span>
          <span style={{ color: "#ff7001", fontWeight: 600 }}>vasay.ai</span>
        </div>
      </div>
    ),
    ogSize,
  );
}
