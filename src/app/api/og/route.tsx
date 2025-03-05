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

export async function GET(request: NextRequest) {
  try {
    const { searchParams, host } = new URL(request.url);

    const name = searchParams.get("name") || "";
    const showImage = searchParams.get("showImage") === "true" || false;
    const avatar = searchParams.get("avatar") || "";
    const title = searchParams.get("title") || "";
    const description = searchParams.get("description") || "";
    const category = searchParams.get("category") || "";
    const date = searchParams.get("date") || new Date().toISOString();
    const readingTime = searchParams.get("readingTime");
    const gradient = searchParams.get("gradient") || "emerald";

    // Define a set of modern gradients
    const gradients = {
      purple: `rgba(13, 3, 33, 1) 0%, rgba(76, 29, 149, 0.8) 50%, rgba(0, 0, 0, 0.9) 100%`,
      cyan: `rgba(3, 33, 33, 1) 0%, rgba(8, 145, 178, 0.8) 50%, rgba(0, 0, 0, 0.9) 100%`,
      emerald: `rgba(3, 33, 20, 1) 0%, rgba(4, 120, 87, 0.8) 50%,rgba(0, 0, 0, 0.9) 100%`,
      blue: `rgba(3, 13, 33, 1) 0%, rgba(30, 64, 175, 0.8) 50%, rgba(0, 0, 0, 0.9) 100%`,
    };

    const selectedGradient =
      gradients[gradient as keyof typeof gradients] || gradients["blue"];

    return new ImageResponse(
      (
        <div
          style={{
            position: "relative",
            // aspectRatio: "1.91/1",
            width: "100%",
            height: "100%",
            overflow: "hidden",
            borderRadius: "0.5rem",
            border: "1px solid #e2e8f0",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            display: "flex",
          }}
        >
          <div
            style={{
              position: "absolute",

              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `linear-gradient(to bottom right, ${selectedGradient})`,
            }}
          />

          <div
            style={{
              position: "absolute",

              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              backdropFilter: "blur(2px)",
            }}
          />

          {/* Decorative elements */}
          <div
            style={{
              position: "absolute",
              top: "3.5rem",
              right: "3.5rem",
              width: "6rem",
              height: "6rem",
              borderRadius: "9999px",
              backgroundColor: "rgba(0,0,0,0.3)",
              filter: "blur(32px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "4rem",
              left: "5rem",
              width: "4rem",
              height: "4rem",
              borderRadius: "9999px",
              backgroundColor: "rgba(0,0,0,0.3)",
              filter: "blur(16px)",
            }}
          />

          {/* Content */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              padding: "50px 80px",
              paddingRight: "50px",
              paddingTop: "50px",
              paddingBottom: "50px",
              paddingLeft: "120px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {/* Category badge */}
            {category && (
              <div
                style={{
                  marginBottom: "1rem",
                  display: "flex",
                }}
              >
                <span
                  style={{
                    padding: "0.5rem 1rem",
                    fontSize: "1.5rem",
                    fontWeight: 500,
                    borderRadius: "9999px",
                    backgroundColor: "rgba(0,0,0, 0.2)",
                    color: "white",
                    border: "1px solid rgba(0,0,0, 0.3)",
                  }}
                >
                  {category || "Design"}
                </span>
              </div>
            )}

            <div
              style={{
                maxWidth: "70%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h2
                style={{
                  fontSize: "3.25rem",
                  fontWeight: "extrabold",
                  color: "white",
                  marginBottom: "1.45rem",
                  lineHeight: 1.2,
                }}
              >
                {title || "Modern Design System"}
              </h2>
              {description && (
                <p
                  style={{
                    fontSize: "1.30rem",
                    color: "rgba(255, 255, 255, 0.8)",
                    marginBottom: "1rem",
                  }}
                >
                  {description}
                </p>
              )}
            </div>

            {/* Author and date */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "1.65rem",
                color: "rgba(255, 255, 255, 0.9)",
                marginTop: "0.5rem",
              }}
            >
              <span style={{ fontWeight: 500 }}>{name}</span>
              <span style={{ margin: "0 0.5rem" }}>•</span>
              <span>{formatDate(date)}</span>
            </div>

            {/* Bottom bar */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "0.375rem",
                backgroundColor: "black",
              }}
            />
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    // console.error("OG Image generation error:", e.message);
    return new Response(e, {
      status: 500,
    });
  }
}
