import { cache } from "react";
import { db } from "@/src/db";
import { siteSettings } from "@/src/db/schemas";
import { eq } from "drizzle-orm";
import { Settings, DEFAULT_SETTINGS } from "@/src/types";

export const getSettings = cache(async () => {
  const settings = await db.select().from(siteSettings);

  return settings.reduce((acc, setting) => {
    acc[setting.key] = {
      value: setting.value || "",
      enabled: setting.enabled as boolean,
    };
    return acc;
  }, {} as Settings);
});

export async function updateSettings(newSettings: Settings) {
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
