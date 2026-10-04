// @vitest-environment node
import { describe, expect, it } from 'vitest';

import { getProfile } from '@/content';
import { LOCALES } from '@/i18n/config';

import Image, { contentType, generateImageMetadata, size } from './opengraph-image';

describe('opengraph-image', () => {
  it.each(LOCALES)('describes the "%s" card from that language profile', (lang) => {
    const { name, role } = getProfile(lang);

    expect(generateImageMetadata({ params: { lang } })).toEqual([
      {
        id: 'card',
        alt: `${name} — ${role}`,
        size: { width: 1200, height: 630 },
        contentType: 'image/png'
      }
    ]);
    expect(size).toEqual({ width: 1200, height: 630 });
    expect(contentType).toBe('image/png');
  });

  it('renders a PNG with the bundled TTF fonts', async () => {
    const response = await Image({ params: Promise.resolve({ lang: 'es' }) });
    const bytes = new Uint8Array(await response.arrayBuffer());

    expect(response.headers.get('content-type')).toBe('image/png');
    // PNG signature
    expect([...bytes.slice(0, 4)]).toEqual([0x89, 0x50, 0x4e, 0x47]);
  });
});
