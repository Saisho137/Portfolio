import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ImageResponse } from 'next/og';

import { getProfile } from '@/content';
import { DEFAULT_LOCALE, hasLocale, localeUrl, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { format } from '@/i18n/format';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// The file convention only accepts a static `alt`; this is how it varies per language.
// Next hands the params here as a plain object (and as a promise to Image)
const toLocale = (lang: string): Locale => (hasLocale(lang) ? lang : DEFAULT_LOCALE);

export const generateImageMetadata = ({ params }: { params: { lang: string } }) => {
  const lang = toLocale(params.lang);
  const { name, role } = getProfile(lang);

  return [
    { id: 'card', alt: format(getDictionary(lang).og.alt, { name, role }), size, contentType }
  ];
};

// next/og (satori) needs TTF/OTF data: it can't read the woff2 files next/font ships
const FONTS_DIR = join(process.cwd(), 'src/assets/fonts/og');

const COLORS = {
  bg: '#0b0b0b',
  fg: '#f2f2f0',
  dim: '#8d8d8d',
  hair: 'rgba(255, 255, 255, 0.25)'
};

/** Social card in the raw-bw style, prerendered at build time from profile.json */
export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const lang = toLocale((await params).lang);
  const profile = getProfile(lang);
  const [mono, sans] = await Promise.all([
    readFile(join(FONTS_DIR, 'FragmentMono-Regular.ttf')),
    readFile(join(FONTS_DIR, 'BricolageGrotesque-ExtraBold.ttf'))
  ]);
  const address = localeUrl(lang).replace('https://', '');
  const words = profile.name.toLowerCase().split(' ');

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        padding: 40,
        background: COLORS.bg,
        color: COLORS.fg,
        fontFamily: 'Fragment Mono'
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          padding: '72px 56px 48px',
          border: `1px dashed ${COLORS.hair}`
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -1,
            left: -1,
            padding: '4px 12px',
            border: `1px dashed ${COLORS.hair}`,
            background: COLORS.bg,
            color: COLORS.dim,
            fontSize: 20
          }}
        >
          section#about
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: 26,
            fontFamily: 'Bricolage Grotesque',
            fontSize: 104,
            lineHeight: 0.9,
            letterSpacing: -4
          }}
        >
          {words.map((word, index) => (
            // Brackets stick to the first/last word so wrapping never orphans them
            <span key={word} style={{ display: 'flex' }}>
              {index === 0 && <span style={{ color: COLORS.dim }}>&lt;</span>}
              {word}
              {index === words.length - 1 && <span style={{ color: COLORS.dim }}>/&gt;</span>}
            </span>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            fontSize: 28
          }}
        >
          <span>{profile.role.toLowerCase()}</span>
          <span style={{ color: COLORS.dim, fontSize: 22 }}>{address}</span>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Fragment Mono', data: mono, weight: 400, style: 'normal' },
        { name: 'Bricolage Grotesque', data: sans, weight: 800, style: 'normal' }
      ]
    }
  );
}
