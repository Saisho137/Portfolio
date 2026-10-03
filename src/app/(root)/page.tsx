import { SkinSwitcher } from '@/components/SkinSwitcher';
import { RawBwSkin } from '@/skins/raw-bw';

// Metadata is inherited from the root layout (single-page site)
export default function HomePage() {
  // raw-bw is server-rendered as children: the only skin in the HTML (SEO, no-JS)
  return (
    <SkinSwitcher>
      <RawBwSkin />
    </SkinSwitcher>
  );
}
