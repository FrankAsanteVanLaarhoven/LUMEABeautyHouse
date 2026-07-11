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
          borderRadius: 40,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 50,
            top: 44,
            width: 26,
            height: 92,
            background: "#faf7f2",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 50,
            top: 110,
            width: 74,
            height: 26,
            background: "#faf7f2",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 40,
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
