import GoogleAnalytics from "../app/components/Analytics/GoogleAnalytics";
import GoogleTagManager from "../app/components/Analytics/GoogleTagManager";
import MixpanelAnalytics from "../app/components/Analytics/MixpanelAnalytics";
import { SiteSettings } from "../types";

export const AnalyticsProviders = ({
  settings,
}: {
  settings: SiteSettings;
}) => {
  if (!settings.gaId || !settings.mixpanelToken || !settings.gtmId) {
    return null;
  }
  return (
    <>
      {settings.gtmId.enabled && (
        <GoogleTagManager gtmId={settings.gtmId.value} />
      )}
      {settings.gaId.enabled && (
        <GoogleAnalytics gaMeasurementId={settings.gaId.value} />
      )}
      {settings.mixpanelToken.enabled && (
        <MixpanelAnalytics token={settings.mixpanelToken.value} />
      )}
    </>
  );
};
