import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

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
          background: "#000",
          color: "#fff",
          fontSize: 24,
          fontStyle: "italic",
          fontFamily: "ui-serif, Georgia, serif",
          fontWeight: 500,
          letterSpacing: "-0.02em",
          borderRadius: 6,
          border: "1px solid rgba(255,255,255,0.18)",
        }}
      >
        A
      </div>
    ),
    {
      ...size,
    },
  );
}
