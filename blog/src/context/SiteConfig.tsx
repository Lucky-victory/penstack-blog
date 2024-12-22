"use client";

import { createContext } from "react";
import { DEFAULT_SETTINGS, Settings } from "../types";

export const SiteConfigContext = createContext<Settings>(DEFAULT_SETTINGS);

export function SiteConfigProvider({
  children,
  initialConfig,
}: {
  children: React.ReactNode;
  initialConfig: Settings;
}) {
  return (
    <SiteConfigContext.Provider
      value={{ ...DEFAULT_SETTINGS, ...initialConfig }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
}
