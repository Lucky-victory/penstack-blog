import {
  extendTheme,
  withDefaultColorScheme,
  type ThemeConfig,
  theme as baseTheme,
  withDefaultProps,
} from "@chakra-ui/react";
const config: ThemeConfig = {
  useSystemColorMode: true,
  initialColorMode: "system",
};

const sizes = {
  sizes: {
    ...baseTheme.space,
    max: "max-content",
    min: "min-content",
    full: "100%",
    "3xs": "14rem",
    "2xs": "16rem",
    xs: "20rem",
    sm: "24rem",
    md: "28rem",
    lg: "32rem",
    xl: "36rem",
    "2xl": "42rem",
    "3xl": "48rem",
    "4xl": "56rem",
    "5xl": "64rem",
    "6xl": "72rem",
    "7xl": "80rem",
    "8xl": "90rem",
    container: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1440px",
      "3xl": "1536px",
      "4xl": "1920px",
    },
  },
};
export const chakraTheme = extendTheme(
  config,
  {
    sizes,
    styles: {
      global: {
        ":root": {
          "--dash-sidebar-mini-w": "60px",
          "--dash-sidebar-w": "230px",
          "--dash-header-h": "65px",
          "--custom-accent-color": "#0070f3",
          "--link-color": "var(--chakra-colors-blue-500)",
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
  withDefaultProps({
    defaultProps: {
      rounded: "lg",
    },
    components: ["Input", "NumberInput", "PinInput", "Button"],
  }),
  withDefaultProps({
    defaultProps: {
      rounded: "xl",
    },
    components: ["Card"],
  }),
  withDefaultColorScheme({ colorScheme: "blue" })
);
