import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Geometric L monogram — never Next.js N */
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
        {/* Vertical bar of L */}
        <div
          style={{
            position: "absolute",
            left: 18,
            top: 16,
            width: 9,
            height: 32,
            background: "#faf7f2",
          }}
        />
        {/* Foot of L */}
        <div
          style={{
            position: "absolute",
            left: 18,
            top: 39,
            width: 26,
            height: 9,
            background: "#faf7f2",
          }}
        />
        {/* Champagne accent */}
        <div
          style={{
            position: "absolute",
            top: 14,
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
