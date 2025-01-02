import { cache } from "react";
import { db } from "@/src/db";
import { siteSettings } from "@/src/db/schemas";
import { SiteSettings } from "@/src/types";
import { DEFAULT_SETTINGS } from "./config";

export const getSettings = cache(async () => {
  const settings = await db.select().from(siteSettings);

  const settingsObj = settings.reduce((acc, setting) => {
    acc[setting.key] = {
      value: setting.value || "",
      enabled: setting.enabled as boolean,
    };
    return acc;
  }, {} as SiteSettings);

  return { ...DEFAULT_SETTINGS, ...settingsObj };
});

export async function updateSettings(newSettings: SiteSettings) {
  const operations = Object.entries(newSettings).map(([key, setting]) => {
    return db
      .insert(siteSettings)
      .values({
        key,
        value: setting.value,
        enabled: setting.enabled,
      })
      .onDuplicateKeyUpdate({
        set: {
          value: setting.value,
          enabled: setting.enabled,
          updated_at: new Date(),
        },
      });
  });

  for (const operation of operations) {
    await operation;
  }
}
