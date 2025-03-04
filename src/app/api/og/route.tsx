import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

// Function to format date
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css?family=${font}&text=${encodeURIComponent(
    text
  )}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  );

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams, host } = new URL(request.url);

    const username = searchParams.get("username") || "";
    const name = searchParams.get("name") || "";
    const avatar = searchParams.get("avatar") || "";
    const title = searchParams.get("title") || "";
    const category = searchParams.get("category") || "";
    const publishDate = searchParams.get("date") || new Date().toISOString();
    const readingTime = searchParams.get("readingTime");
    const gradient = searchParams.get("gradient") || "4"; // Default gradient option

    // Define a set of modern gradients
    const gradients = {
      "1": "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)", // Indigo to Purple to Pink
      "2": "linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 100%)", // Sky to Purple
      "3": "linear-gradient(135deg, #10B981 0%, #3B82F6 100%)", // Emerald to Blue
      "4": "linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)", // Amber to Red
      "5": "linear-gradient(135deg, #111827 0%, #4B5563 100%)", // Dark
    };

    const selectedGradient =
      gradients[gradient as keyof typeof gradients] || gradients["4"];

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            background: selectedGradient,
            position: "relative",
            fontFamily: "Plus Jakarta Sans",
            padding: "20px",
          }}
        >
          {/* Content Section */}
          <div
            style={{
              position: "relative",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              padding: "58px 100px",
              paddingBottom: "50px",
              justifyContent: "space-between",
              background: gradients["5"],
              height: "100%",
              borderRadius: "20px",
              zIndex: 1,
            }}
          >
            {/* Top Section */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              {/* Category Tag */}
              {category && (
                <div
                  style={{
                    padding: "8px 16px",
                    borderRadius: "24px",
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(8px)",
                    color: "white",
                    fontSize: "20px",
                    fontWeight: "600",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {category}
                </div>
              )}

              {/* Reading Time & Date */}
              <div
                style={{
                  color: "rgba(255, 255, 255, 0.85)",
                  fontSize: "18px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {formatDate(publishDate)}
                {readingTime && (
                  <>
                    <div
                      style={{
                        width: "4px",
                        height: "4px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(255, 255, 255, 0.5)",
                      }}
                    />
                    <span>{readingTime} min read</span>
                  </>
                )}
              </div>
            </div>

            {/* Middle Section - Title */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                gap: "24px",
                marginTop: "-35px", // Offset to center vertically
              }}
            >
              <div
                style={{
                  fontSize: "70px",
                  fontWeight: "800",
                  color: "white",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  maxWidth: "90%",
                  textAlign: "left",

                  textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                }}
              >
                {title}
              </div>

              {/* Visual accent line */}
              <div
                style={{
                  width: "120px",
                  height: "4px",
                  backgroundColor: "white",
                  borderRadius: "2px",
                  opacity: 0.7,
                }}
              />
            </div>

            {/* Bottom Section - Author & Host */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              {/* Author Section */}
              {name && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <div
                      style={{
                        color: "rgba(255, 255, 255, 0.7)",
                        fontSize: "16px",
                      }}
                    >
                      Written by
                    </div>
                    <div
                      style={{
                        color: "white",
                        fontSize: "24px",
                        fontWeight: "700",
                      }}
                    >
                      {name}
                    </div>
                  </div>
                </div>
              )}

              {/* Host/Website URL */}
              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(8px)",
                  padding: "6px 16px",
                  borderRadius: "24px",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "600",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                {host}
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Plus Jakarta Sans",
            data: await loadGoogleFont("Plus+Jakarta+Sans", title),
            weight: 700,
          },
        ],
      }
    );
  } catch (e: any) {
    console.error("OG Image generation error:", e.message);
    return new Response(`Failed to generate image: ${e.message}`, {
      status: 500,
    });
  }
}

function getNameInitials(name: string) {
  const names = name.split(" ");
  if (names.length === 1) {
    return name.slice(0, 2);
  }
  return names[0].charAt(0) + names[names.length - 1].charAt(0);
}
