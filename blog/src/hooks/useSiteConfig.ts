"use client";
import { useContext } from "react";
import { SiteConfigContext } from "../context/SiteConfig";

export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);

  if (!context) {
    throw new Error("useSiteConfig must be used within a SiteConfigProvider");
  }

  return context;
};
