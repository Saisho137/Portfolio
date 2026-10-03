import type { Metadata } from 'next';

import { SkinSwitcher } from '@/components/SkinSwitcher';
import { RawBwSkin } from '@/skins/raw-bw';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/utils/constants';
import { generateMetadata } from '@/utils/helpers';

export default function HomePage() {
  // raw-bw is server-rendered as children: the only skin in the HTML (SEO, no-JS)
  return (
    <SkinSwitcher>
      <RawBwSkin />
    </SkinSwitcher>
  );
}

export const metadata: Metadata = generateMetadata({
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL
});
