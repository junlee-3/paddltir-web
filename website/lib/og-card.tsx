import { ImageResponse } from "next/og";

/**
 * Shared OG-card renderer for the homepage, blog posts and guides: the
 * hero-card look (warm paper + vermillion glow bleeding from the upper
 * left), logo row, big Switzer title. No URL or chip labels.
 * review on #61). Callers (the per-route opengraph-image.tsx files, edge
 * runtime) pass their copy in.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

export async function ogCard({
  badge,
  title,
  description,
}: {
  /** Optional small pill next to the logo: "Blog" or "Guide". */
  badge?: string;
  title: string;
  description: string;
}) {
  const [regular, medium] = await Promise.all([
    fetch(new URL("../app/fonts/Switzer-Regular.otf", import.meta.url)).then(
      (r) => r.arrayBuffer(),
    ),
    fetch(new URL("../app/fonts/Switzer-Medium.otf", import.meta.url)).then(
      (r) => r.arrayBuffer(),
    ),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 72,
          backgroundColor: "#fcfbf9",
          // The hero-card glow: warm vermillion bleeding from the upper left.
          backgroundImage:
            "radial-gradient(circle at 12% 22%, rgba(250, 82, 15, 0.10) 0%, rgba(252, 251, 249, 0) 60%)",
          color: "#18181b",
          fontFamily: "Switzer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              backgroundColor: "#fa520f",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
            }}
          >
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: 9999,
                backgroundColor: "#ffffff",
              }}
            />
            <div
              style={{
                width: 13,
                height: 7,
                borderRadius: 9999,
                backgroundColor: "#ffffff",
              }}
            />
          </div>
          <div style={{ fontSize: 32, fontWeight: 500, letterSpacing: -0.5 }}>
            Paddltir
          </div>
          {badge ? (
            <div
              style={{
                marginLeft: 8,
                fontSize: 17,
                color: "#71717a",
                border: "1px solid #e4e4e7",
                borderRadius: 999,
                padding: "6px 16px",
              }}
            >
              {badge}
            </div>
          ) : null}
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 22,
            paddingBottom: 36,
          }}
        >
          <div
            style={{
              fontSize: title.length > 42 ? 56 : 64,
              fontWeight: 500,
              letterSpacing: -1.6,
              lineHeight: 1.06,
              maxWidth: 1000,
              color: "#18181b",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 25,
              fontWeight: 400,
              color: "#71717a",
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            {description}
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Switzer", data: regular, weight: 400, style: "normal" },
        { name: "Switzer", data: medium, weight: 500, style: "normal" },
      ],
    },
  );
}
