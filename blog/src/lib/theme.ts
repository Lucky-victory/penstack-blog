import {
  extendTheme,
  withDefaultColorScheme,
  type ThemeConfig,
} from "@chakra-ui/react";
const config: ThemeConfig = {
  useSystemColorMode: true,
  initialColorMode: "system",
};
export const theme = extendTheme(
  config,
  {
    styles: {
      global: {
        ":root": {
          "--dash-sidebar-mini-w": "60px",
          "--dash-sidebar-w": "240px",
          "--dash-header-h": "65px",
          "--custom-accent-color": "#0070f3",
          "--card-raised-soft":
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          "--card-raised": "var(--card-raised-soft)",
        },
      },
    },
    fonts: {
      heading: "var(--font-karla)",
      body: "var(--font-rubik)",
    },
  },
  withDefaultColorScheme({ colorScheme: "blue" })
);
