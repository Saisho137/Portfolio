import { describe, expect, it } from 'vitest';

import manifest from './manifest';

describe('manifest.webmanifest', () => {
  const data = manifest();

  it('uses the profile name and the raw-bw colors', () => {
    expect(data.name).toContain('Santiago Betancur Duque');
    expect(data).toMatchObject({ start_url: '/', background_color: '#0b0b0b' });
  });

  it('does not lock the orientation (WCAG 1.3.4)', () => {
    expect(data).not.toHaveProperty('orientation');
  });

  it('ships 192/512 PNG icons and a maskable one', () => {
    const sizes = data.icons?.map((icon) => icon.sizes);

    expect(sizes).toEqual(expect.arrayContaining(['192x192', '512x512']));
    expect(data.icons?.some((icon) => icon.purpose === 'maskable')).toBe(true);
  });
});
