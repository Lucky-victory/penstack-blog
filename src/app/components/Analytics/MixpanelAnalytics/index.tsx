"use client";
import { useEffect } from "react";
import mixpanel from "mixpanel-browser";

export const initMixpanel = ({ token }: { token: string }) => {
  if (!token) {
    console.warn("Mixpanel token is missing! Check your .env file.");
    return;
  }

  mixpanel.init(token, { autotrack: true });
};

export default function MixpanelAnalytics({ token }: { token: string }) {
  useEffect(() => {
    initMixpanel({ token });
  }, [token]);

  return <></>;
}
