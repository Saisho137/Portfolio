import { getProfile } from '@/content';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import type { SkinProps } from '@/skins/types';

/** What the page hands to a skin for one language */
export const skinProps = (lang: Locale): SkinProps => ({
  profile: getProfile(lang),
  dict: getDictionary(lang),
  lang
});

const leaves = (value: unknown): string[] =>
  typeof value === 'string'
    ? [value]
    : typeof value === 'object' && value !== null
      ? Object.values(value).flatMap(leaves)
      : [];

/**
 * Texts that only exist in `other` (dictionary + profile), never in `lang`'s data.
 * If one shows up while rendering `lang`, a string is hardcoded or leaked across languages.
 */
export const textsOnlyIn = (other: Locale, lang: Locale): string[] => {
  const own = new Set(leaves(skinProps(lang)).map((text) => text.toLowerCase()));

  return [...new Set(leaves(skinProps(other)).map((text) => text.toLowerCase()))].filter(
    (text) => !own.has(text)
  );
};

/** Every rendered text node, trimmed and lowercased (whole strings, not substrings) */
export const textNodes = (root: Node): string[] => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const texts: string[] = [];

  while (walker.nextNode()) {
    const text = walker.currentNode.textContent?.trim().toLowerCase();
    if (text) texts.push(text);
  }

  return texts;
};
