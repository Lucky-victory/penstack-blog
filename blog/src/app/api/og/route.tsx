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
    const readingTime = searchParams.get("readingTime") || "0";

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            background: "#1a1a1a",
            position: "relative",
          }}
        >
          {/* Background Gradient Section */}
          <div
            style={{
              position: "absolute",
              display: "flex",
              width: "50%",
              maxWidth: 450,
              top: 30,
              left: 720,
              bottom: 30,
              right: 30,
              borderRadius: 20,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "110%",
                width: "100%",
                position: "absolute",
                top: "-5%",
                right: "-10%",
                borderTopLeftRadius: "9999px",
                borderBottomLeftRadius: "9999px",
                background: `${getRandomColorSet()[0]} `,
              }}
            ></div>
            <div
              style={{
                height: "95%",
                width: "100%",
                position: "absolute",
                maxWidth: 350,
                top: "2%",
                right: "-10%",
                borderTopLeftRadius: "9999px",
                borderBottomLeftRadius: "9999px",
                background: `${getRandomColorSet()[1]} `,
              }}
            ></div>
            <div
              style={{
                height: "75%",
                width: "100%",
                maxWidth: 250,
                position: "absolute",
                // transform: "translateY(-50%)",
                top: "10%",
                right: "-10%",
                borderTopLeftRadius: "9999px",
                borderBottomLeftRadius: "9999px",
                background: `${getRandomColorSet()[2]} `,
              }}
            ></div>
          </div>

          {/* Content Section */}
          <div
            style={{
              position: "relative",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              padding: "60px",
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
                    backgroundColor: "#007bff",
                    padding: "8px 16px",
                    borderRadius: "999px",
                    display: "flex",
                    color: "white",
                    fontSize: "24px",
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
                {formatDate(publishDate)} · {readingTime + " min read time"}
              </div>
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: "72px",
                fontWeight: "bold",
                color: "white",
                display: "flex",
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
                name && (
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "128px",
                      backgroundColor: "#007bff",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                      fontWeight: "bold",
                      border: "2px solid #f1f1f3",
                      textTransform: "uppercase",
                    }}
                  >
                    {getNameInitials(name)}
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
          <div
            style={{
              position: "absolute",
              top: 30,
              left: 30,
              bottom: 30,
              right: 30,
              display: "flex",
              border: "4px solid #f1f1f3",
              borderRadius: 16,
            }}
          ></div>
          {/* Watermark/Brand */}
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              right: "35px",
              display: "flex",
              color: "#ffffff66",
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
