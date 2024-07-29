
import { extendTheme,withDefaultColorScheme } from "@chakra-ui/react";

export const theme = extendTheme({
  styles: {
    global: {
      ":root": {
        "--dash-sidebar-mini-w": "60px",
        "--dash-sidebar-w": "250px",
        "--custom-accent-color": "#0070f3",
      },
    },
  },
    fonts: {
      heading: 'var(--font-rubik)',
      body: 'var(--font-rubik)',
    },

  },
withDefaultColorScheme({colorScheme:'blue'})
)