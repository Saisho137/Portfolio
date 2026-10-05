import { afterEach, describe, expect, it, vi } from 'vitest';

import { isAnalyticsEnabled, trackEvent } from './analytics';

const sendGAEvent = vi.hoisted(() => vi.fn());
vi.mock('@next/third-parties/google', () => ({ sendGAEvent }));

describe('trackEvent', () => {
  afterEach(() => {
    delete window.dataLayer;
  });

  it('sends a GA4 event with its parameters once the GA script set up the dataLayer', () => {
    window.dataLayer = [];

    trackEvent('skin_change', { skin: 'brutalist' });

    expect(sendGAEvent).toHaveBeenCalledWith('event', 'skin_change', { skin: 'brutalist' });
  });

  it('does nothing without the GA script (dev, previews, tests)', () => {
    trackEvent('email_copy', {});

    expect(sendGAEvent).not.toHaveBeenCalled();
  });
});

describe('isAnalyticsEnabled', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it.each([
    ['production', true],
    ['preview', false],
    [undefined, false]
  ])('is %s → %s (only the production deployment reports)', (env, enabled) => {
    vi.stubEnv('VERCEL_ENV', env);

    expect(isAnalyticsEnabled()).toBe(enabled);
  });
});
