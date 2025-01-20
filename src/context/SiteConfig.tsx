"use client";

import { createContext } from "react";
import { SiteSettings } from "../types";
import { DEFAULT_SETTINGS } from "../lib/settings/config";

export const SiteConfigContext = createContext<SiteSettings>(DEFAULT_SETTINGS);

export function SiteConfigProvider({
  children,
  initialConfig,
}: {
  children: React.ReactNode;
  initialConfig: SiteSettings;
}) {
  return (
    <SiteConfigContext.Provider
      value={{ ...DEFAULT_SETTINGS, ...initialConfig }}
    >
      {children}
    </SiteConfigContext.Provider>
  );
}
