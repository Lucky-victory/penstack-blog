import mixpanel from "mixpanel-browser";
export const initMixpanel = ({ token }: { token: string }) => {
  if (!token) {
    console.warn("Mixpanel token is missing!");
    return;
  }

  mixpanel.init(token, {
    debug: true,
    track_pageview: true,
    persistence: "localStorage",
  });
};
