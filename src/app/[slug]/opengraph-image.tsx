import { ImageResponse } from "next/og";
import { getInvitationBySlug } from "@/app/actions/invitation";

export const alt = "Wedding Invitation Preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ to?: string }>;
}) {
  const { slug } = await params;
  const { to } = await searchParams;
  const invitation = await getInvitationBySlug(slug);

  const groomName = invitation?.groomName || "Mempelai Pria";
  const brideName = invitation?.brideName || "Mempelai Wanita";
  const guestName = to || null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fafaf9 0%, #f5f5f4 50%, #e7e5e4 100%)",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Top decorative line */}
        <div
          style={{
            display: "flex",
            width: "80px",
            height: "1px",
            background: "#a8a29e",
            marginBottom: "32px",
          }}
        />

        {/* "The Wedding of" label */}
        <p
          style={{
            fontSize: "14px",
            letterSpacing: "6px",
            textTransform: "uppercase",
            color: "#a8a29e",
            marginBottom: "24px",
          }}
        >
          THE WEDDING OF
        </p>

        {/* Names */}
        <h1
          style={{
            fontSize: "64px",
            fontWeight: 600,
            color: "#1c1917",
            margin: "0 0 8px 0",
            lineHeight: 1.1,
          }}
        >
          {groomName}
        </h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            margin: "8px 0",
          }}
        >
          <div style={{ display: "flex", width: "40px", height: "1px", background: "#d6d3d1" }} />
          <span style={{ fontSize: "28px", color: "#a8a29e", fontStyle: "italic" }}>&</span>
          <div style={{ display: "flex", width: "40px", height: "1px", background: "#d6d3d1" }} />
        </div>

        <h1
          style={{
            fontSize: "64px",
            fontWeight: 600,
            color: "#1c1917",
            margin: "8px 0 32px 0",
            lineHeight: 1.1,
          }}
        >
          {brideName}
        </h1>

        {/* Guest name */}
        {guestName && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "16px 32px",
              borderRadius: "12px",
              border: "1px solid #e7e5e4",
              background: "rgba(255,255,255,0.6)",
              marginTop: "8px",
            }}
          >
            <p
              style={{
                fontSize: "12px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#a8a29e",
                marginBottom: "4px",
              }}
            >
              UNDANGAN SPESIAL UNTUK
            </p>
            <p
              style={{
                fontSize: "24px",
                fontWeight: 600,
                color: "#44403c",
              }}
            >
              {guestName}
            </p>
          </div>
        )}

        {/* Bottom decorative line */}
        <div
          style={{
            display: "flex",
            width: "80px",
            height: "1px",
            background: "#a8a29e",
            marginTop: "32px",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
