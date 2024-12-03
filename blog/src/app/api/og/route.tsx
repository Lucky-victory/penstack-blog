import { ImageResponse } from "next/og";

// Function to format date
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

const colorMatrix = [
  // Cosmic Night (Deep Purple/Blue)
  [
    "rgba(123, 44, 191, 0.30)", // Purple
    "rgba(62, 94, 222, 0.25)", // Indigo
    "rgba(67, 97, 238, 0.35)", // Electric Blue
  ],

  // Ocean Depths (Deep Teal/Emerald)
  [
    "rgba(6, 95, 70, 0.35)", // Deep Teal
    "rgba(13, 148, 136, 0.30)", // Teal
    "rgba(8, 145, 178, 0.25)", // Ocean Blue
  ],

  // Sunset Glow (Warm Red/Purple)
  [
    "rgba(157, 23, 77, 0.25)", // Deep Rose
    "rgba(190, 24, 93, 0.30)", // Rose
    "rgba(219, 39, 119, 0.35)", // Pink
  ],

  // Arctic Aurora (Blue/Indigo)
  [
    "rgba(30, 64, 175, 0.30)", // Deep Blue
    "rgba(29, 78, 216, 0.35)", // Royal Blue
    "rgba(37, 99, 235, 0.25)", // Bright Blue
  ],

  // Forest Mist (Deep Green/Blue)
  [
    "rgba(6, 95, 70, 0.35)", // Forest Green
    "rgba(4, 120, 87, 0.25)", // Emerald
    "rgba(5, 150, 105, 0.30)", // Sea Green
  ],
];

const getRandomColorSet = () =>
  colorMatrix[Math.floor(Math.random() * colorMatrix.length)];

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
    const readingTime = searchParams.get("readingTime");

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",

            background:
              "linear-gradient(90deg, rgba(223, 113, 85, 1) 0%, rgba(59, 6, 66, 1) 100%)",
            position: "relative",
          }}
        >
          {/* Content Section */}
          <div
            style={{
              position: "relative",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              padding: "60px",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              height: "100%",
            }}
          >
            {/* Category & Date */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              {category && (
                <div
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(223, 113, 85, 1) 0%, rgba(59, 6, 66, 1) 10%)",
                    padding: "6px 14px",
                    borderRadius: "999px",
                    border: "2px solid #1a1a1a",
                    display: "flex",
                    color: "white",
                    fontSize: "20px",
                    fontWeight: "semibold",
                  }}
                >
                  {category}
                </div>
              )}

              {/* Title */}
              <div
                style={{
                  fontSize: "72px",
                  fontWeight: "bold",
                  color: "white",
                  display: "flex",
                  lineHeight: 1.2,
                  marginBottom: "18px",
                  maxWidth: "80%",
                }}
              >
                {title}
              </div>
              <div
                style={{
                  color: "#ffffffaa",
                  fontSize: "24px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {formatDate(publishDate)}{" "}
                {readingTime && `· ${readingTime} min read time`}
              </div>
            </div>

            {/* Author Section */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginTop: "60px",
              }}
            >
              {name && (
                <p
                  style={{
                    color: "white",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                >
                  By
                </p>
              )}
              {avatar ? (
                <img
                  src={avatar}
                  width={50}
                  height={50}
                  alt={name}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "128px",
                    border: "2px solid #1a1a1a",
                  }}
                />
              ) : (
                name && (
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "128px",

                      background:
                        "linear-gradient(90deg, rgba(223, 113, 85, 1) 0%, rgba(59, 6, 66, 1) 10%)",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                      fontWeight: "bold",
                      border: "2px solid #1a1a1a",
                      textTransform: "uppercase",
                    }}
                  >
                    <p>{getNameInitials(name)}</p>
                  </div>
                )
              )}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                {name && (
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
                )}
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
              bottom: "40px",
              right: "45px",
              display: "flex",
              color: "#ffffff99",
              fontSize: "20px",
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
