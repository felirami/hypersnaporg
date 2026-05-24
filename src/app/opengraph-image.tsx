import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#020617",
          color: "white",
          padding: 72,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 20%, rgba(34,211,238,0.35), transparent 34%), radial-gradient(circle at 80% 20%, rgba(16,185,129,0.22), transparent 32%)",
          }}
        />
        {/* Static network mesh pattern */}
        <svg
          style={{ position: "absolute", inset: 0, opacity: 0.45 }}
          width="1200"
          height="630"
          viewBox="0 0 1200 630"
        >
          <line x1="900" y1="80" x2="1050" y2="180" stroke="rgba(103,232,249,0.3)" strokeWidth="1" />
          <line x1="1050" y1="180" x2="1100" y2="320" stroke="rgba(110,231,183,0.25)" strokeWidth="1" />
          <line x1="900" y1="80" x2="1100" y2="320" stroke="rgba(103,232,249,0.15)" strokeWidth="1" />
          <line x1="850" y1="250" x2="1050" y2="180" stroke="rgba(103,232,249,0.2)" strokeWidth="1" />
          <line x1="950" y1="400" x2="1100" y2="320" stroke="rgba(110,231,183,0.2)" strokeWidth="1" />
          <line x1="800" y1="150" x2="850" y2="250" stroke="rgba(103,232,249,0.18)" strokeWidth="1" />
          <circle cx="900" cy="80" r="6" fill="rgba(103,232,249,0.9)" />
          <circle cx="1050" cy="180" r="5" fill="rgba(110,231,183,0.85)" />
          <circle cx="1100" cy="320" r="5" fill="rgba(103,232,249,0.8)" />
          <circle cx="850" cy="250" r="4" fill="rgba(167,243,208,0.75)" />
          <circle cx="950" cy="400" r="4" fill="rgba(103,232,249,0.7)" />
          <circle cx="800" cy="150" r="4" fill="rgba(110,231,183,0.65)" />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(2,6,23,0.95) 0%, rgba(2,6,23,0.7) 55%, rgba(2,6,23,0.2) 100%)",
          }}
        />
        <div style={{ position: "relative", display: "flex", gap: 16, alignItems: "center" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              border: "1px solid rgba(103,232,249,0.45)",
              background: "rgba(34,211,238,0.12)",
            }}
          />
          <div style={{ fontSize: 30, letterSpacing: 0 }}>hypersnap.org</div>
        </div>
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: 0,
              background: "linear-gradient(to right, #ffffff, #cffafe, #a7f3d0)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Hypersnap
          </div>
          <div style={{ maxWidth: 860, fontSize: 36, lineHeight: 1.25, color: "#f8fafc" }}>
            A decentralized social network — actually decentralized.
          </div>
          <div style={{ maxWidth: 860, fontSize: 24, lineHeight: 1.4, color: "#94a3b8" }}>
            Hypersnap.org made by Felirami, a solo developer contributing to the new Farcaster.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
