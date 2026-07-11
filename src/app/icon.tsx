import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** App icon — LUMÉA mark (never Next.js N) */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a1612",
          borderRadius: "50%",
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 34,
            fontFamily: "Georgia, serif",
            color: "#faf7f2",
            letterSpacing: 1,
            lineHeight: 1,
            marginTop: 2,
          }}
        >
          L
        </div>
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 14,
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#c4a574",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
