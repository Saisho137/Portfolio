import { sendGAEvent } from '@next/third-parties/google';

import type { Theme } from '@/utils/theme';

/** GA4 property of the site (public by design: it ships in the HTML) */
export const GA_MEASUREMENT_ID = 'G-Q7NJCZDQBL';

/**
 * Only the production deployment reports: `next dev`, Vercel previews and local
 * `next start` runs (E2E, Lighthouse) would count as fake visits. Read at build time.
 */
export const isAnalyticsEnabled = () => process.env.VERCEL_ENV === 'production';

/**
 * Every custom event and its parameters (GA4 naming: snake_case, no personal data).
 * Page views, outbound clicks and scroll come from GA4's enhanced measurement.
 */
interface AnalyticsEvents {
  skin_change: { skin: string };
  theme_change: { theme: Theme };
  email_copy: Record<string, never>;
}

export const trackEvent = <Name extends keyof AnalyticsEvents>(
  name: Name,
  params: AnalyticsEvents[Name]
) => {
  // Without the GA script (dev, previews, tests) there is no dataLayer: nothing to send
  if (typeof window === 'undefined' || !window.dataLayer) return;

  sendGAEvent('event', name, params);
};
