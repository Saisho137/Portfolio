import type { Metadata } from 'next';

import { RawBwSkin } from '@/skins/raw-bw';
import { PROFILE_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/utils/constants';
import { generateMetadata } from '@/utils/helpers';

export default function HomePage() {
  return <RawBwSkin />;
}

export const metadata: Metadata = generateMetadata({
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  image: PROFILE_IMAGE
});
