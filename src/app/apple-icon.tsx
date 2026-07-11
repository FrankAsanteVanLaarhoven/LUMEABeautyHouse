import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          borderRadius: 36,
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontFamily: "Georgia, serif",
            color: "#faf7f2",
            lineHeight: 1,
          }}
        >
          L
        </div>
        <div
          style={{
            position: "absolute",
            top: 36,
            right: 40,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#c4a574",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
