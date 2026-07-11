import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "LUMÉA — Beauty Without Boundaries";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1a1612",
          padding: 72,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#faf7f2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1a1612",
              fontSize: 28,
            }}
          >
            L
          </div>
          <div
            style={{
              color: "#c4a574",
              fontSize: 18,
              letterSpacing: 8,
              textTransform: "uppercase",
            }}
          >
            LUMÉA
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              color: "#faf7f2",
              fontSize: 72,
              lineHeight: 1.05,
              maxWidth: 900,
            }}
          >
            Light for every face.
          </div>
          <div
            style={{
              color: "rgba(250,247,242,0.65)",
              fontSize: 28,
              fontFamily: "system-ui, sans-serif",
              maxWidth: 720,
            }}
          >
            Inclusive beauty · Mirror Studio · hair & skin rituals
          </div>
        </div>
        <div
          style={{
            color: "#c4a574",
            fontSize: 16,
            letterSpacing: 4,
            textTransform: "uppercase",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Beauty without boundaries
        </div>
      </div>
    ),
    { ...size }
  );
}
