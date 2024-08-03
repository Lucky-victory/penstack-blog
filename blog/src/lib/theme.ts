
import { extendTheme,withDefaultColorScheme } from "@chakra-ui/react";

export const theme = extendTheme({
  styles: {
    global: {
      ":root": {
        "--dash-sidebar-mini-w": "65px",
        "--dash-sidebar-w": "250px",
        "--custom-accent-color": "#0070f3","--card-raised-soft":"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)","--card-raised":"var(--card-raised-soft)"
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