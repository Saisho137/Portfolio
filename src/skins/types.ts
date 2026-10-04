import type { Profile } from '@/content/types';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';

/** Every skin renders the same data: the profile and UI strings of one language */
export interface SkinProps {
  profile: Profile;
  dict: Dictionary;
  lang: Locale;
}
