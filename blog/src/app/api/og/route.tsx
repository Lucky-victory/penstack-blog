import { ImageResponse } from "next/og";

// Function to format date
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(
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
export async function GET(request: Request) {
  try {
    const { searchParams, host } = new URL(request.url);

    const username = searchParams.get("username") || "";
    const name = searchParams.get("name") || "";
    const avatar = searchParams.get("avatar") || "";
    const title = searchParams.get("title") || "";
    const category = searchParams.get("category") || "";
    const publishDate = searchParams.get("date") || new Date().toISOString();
    const readingTime = searchParams.get("readingTime") || "0";

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#1a1a1a",
            position: "relative",
          }}
        >
          {/* Gradient Overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              background:
                "linear-gradient(45deg, rgba(76, 0, 255, 0.1) 0%, rgba(255, 0, 128, 0.1) 100%)",
              //   zIndex: 1,
            }}
          />

          {/* Main Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "60px",
              //   zIndex: 2,
            }}
          >
            {/* Category & Date */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              {category && (
                <div
                  style={{
                    backgroundColor: "#4c00ff",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    color: "white",
                    fontSize: "24px",
                    display: "flex",
                  }}
                >
                  {category}
                </div>
              )}
              <div
                style={{
                  color: "#ffffff99",
                  fontSize: "24px",
                  display: "flex",
                }}
              >
                {formatDate(publishDate)} · {readingTime}
              </div>
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: "72px",
                fontWeight: "bold",
                color: "white",
                lineHeight: 1.2,
                marginBottom: "48px",
                maxWidth: "80%",
              }}
            >
              {title}
            </div>

            {/* Author Section */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginTop: "auto",
              }}
            >
              {avatar ? (
                <img
                  src={avatar}
                  width={56}
                  height={56}
                  alt={name}
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "28px",
                    border: "2px solid white",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "128px",
                    backgroundColor: "#4c00ff",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    fontWeight: "bold",
                    border: "2px solid white",
                    textTransform: "uppercase",
                  }}
                >
                  {getNameInitials(name)}
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <div
                  style={{
                    color: "white",
                    fontSize: "24px",
                    fontWeight: "bold",
                    display: "flex",
                  }}
                >
                  {name}
                </div>
                {username && (
                  <div
                    style={{
                      color: "#ffffff99",
                      fontSize: "20px",
                      display: "flex",
                    }}
                  >
                    @{username}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Watermark/Brand */}
          <div
            style={{
              position: "absolute",
              bottom: "24px",
              right: "24px",
              color: "#ffffff66",
              fontSize: "20px",
              //   zIndex: 2,
            }}
          >
            {host}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Inter",
            data: await loadGoogleFont("Inter", title),
            weight: 700,
          },
        ],
      }
    );
  } catch (e) {
    return new Response(`Failed to generate image`, {
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
