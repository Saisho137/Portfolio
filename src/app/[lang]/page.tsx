import { SkinSwitcher } from '@/components/SkinSwitcher';
import { getProfile } from '@/content';
import { getDictionary } from '@/i18n/dictionaries';
import { RawBwSkin } from '@/skins/raw-bw';

import { type LangParams, resolveLang } from './params';

// Metadata is inherited from the [lang] root layout (single-page site)
export default async function HomePage(props: LangParams) {
  const lang = await resolveLang(props);
  const dict = getDictionary(lang);

  // raw-bw is server-rendered as children: the only skin in the HTML (SEO, no-JS)
  return (
    <SkinSwitcher lang={lang} labels={dict.settings}>
      <RawBwSkin profile={getProfile(lang)} dict={dict} lang={lang} />
    </SkinSwitcher>
  );
}
