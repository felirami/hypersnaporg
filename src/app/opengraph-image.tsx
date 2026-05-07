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
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: 0 }}>Hypersnap</div>
          <div style={{ maxWidth: 860, fontSize: 34, lineHeight: 1.25, color: "#cbd5e1" }}>
            A decentralized fork of Snapchain for Farcaster data, nodes, APIs, and contributors.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
