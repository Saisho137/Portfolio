// @vitest-environment node
import { describe, expect, it } from 'vitest';

import { profile } from '@/content';

import Image, { alt, contentType, size } from './opengraph-image';

describe('opengraph-image', () => {
  it('describes the card from the profile content', () => {
    expect(alt).toContain(profile.name);
    expect(size).toEqual({ width: 1200, height: 630 });
    expect(contentType).toBe('image/png');
  });

  it('renders a PNG with the bundled TTF fonts', async () => {
    const response = await Image();
    const bytes = new Uint8Array(await response.arrayBuffer());

    expect(response.headers.get('content-type')).toBe('image/png');
    // PNG signature
    expect([...bytes.slice(0, 4)]).toEqual([0x89, 0x50, 0x4e, 0x47]);
  });
});
