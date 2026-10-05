'use client';

import { type FC, type ReactNode, useState } from 'react';
import { flushSync } from 'react-dom';

import { ThemeToggle } from '@/components/ThemeToggle';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries';
import { format } from '@/i18n/format';
import { trackEvent } from '@/utils/analytics';

import { BrushIcon, CodeBwIcon, CodeColorIcon } from './icons';
import { SkinErrorBoundary } from './SkinErrorBoundary';
import { DEFAULT_SKIN, isLazySkin, type LoadedSkin, loadSkin, type SkinId } from './skins';

import styles from './SkinSwitcher.module.css';

const OPTIONS: { id: SkinId; Icon: FC }[] = [
  { id: 'raw-bw', Icon: CodeBwIcon },
  { id: 'raw-color', Icon: CodeColorIcon },
  { id: 'brutalist', Icon: BrushIcon }
];

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface SkinSwitcherProps {
  /** The default (raw-bw) skin, already rendered on the server. Never discarded. */
  children: ReactNode;
  lang: Locale;
  /** UI strings only: the lazy skins fetch their own content in the active language */
  labels: Dictionary['settings'];
}

const SkinSwitcher: FC<SkinSwitcherProps> = ({ children, lang, labels }) => {
  // `loaded` is only set for lazy skins; raw-bw is always `children`
  const [skin, setSkin] = useState<{ id: SkinId; loaded?: LoadedSkin }>({ id: DEFAULT_SKIN });
  const [announcement, setAnnouncement] = useState('');

  // Prefetch on intent: hover (desktop), focus (keyboard), touchstart (mobile, no hover)
  const prefetch = (id: SkinId) => {
    if (isLazySkin(id)) loadSkin(id, lang).catch(() => undefined);
  };

  const select = async (id: SkinId) => {
    if (id === skin.id) return;

    let loaded: LoadedSkin | undefined;
    try {
      // Usually resolved already thanks to the prefetch
      if (isLazySkin(id)) loaded = await loadSkin(id, lang);
    } catch {
      return; // offline or chunk error: keep the current skin
    }

    const apply = () => {
      setSkin({ id, loaded });
      setAnnouncement(format(labels.announce, { skin: labels.skins[id] }));
    };

    if (typeof document.startViewTransition === 'function' && !prefersReducedMotion()) {
      // flushSync so the transition snapshots the new DOM synchronously
      document.startViewTransition(() => flushSync(apply));
    } else {
      apply();
    }

    trackEvent('skin_change', { skin: id });
  };

  // Render error in a lazy skin: back to the default one, announced like a manual change
  const fallBack = () => {
    setSkin({ id: DEFAULT_SKIN });
    setAnnouncement(format(labels.announce, { skin: labels.skins[DEFAULT_SKIN] }));
  };

  const { loaded } = skin;

  return (
    <>
      {loaded ? (
        <SkinErrorBoundary key={skin.id} fallback={children} onError={fallBack}>
          <loaded.Component {...loaded.props} />
        </SkinErrorBoundary>
      ) : (
        children
      )}

      {/* Landmark so the controls aren't orphan content (axe `region`) */}
      <aside className={styles.toolbar} aria-label={labels.label}>
        <fieldset className={styles.switcher}>
          <legend className='visually-hidden'>{labels.style}</legend>
          {OPTIONS.map(({ id, Icon }) => (
            <label
              key={id}
              className={styles.option}
              title={labels.skins[id]}
              onPointerEnter={() => prefetch(id)}
              onTouchStart={() => prefetch(id)}
            >
              <input
                className={styles.radio}
                type='radio'
                name='skin'
                value={id}
                checked={skin.id === id}
                onChange={() => void select(id)}
                onFocus={() => prefetch(id)}
              />
              <Icon />
              <span className='visually-hidden'>{labels.skins[id]}</span>
            </label>
          ))}
        </fieldset>
        <ThemeToggle labels={labels.theme} />
        <p className='visually-hidden' aria-live='polite'>
          {announcement}
        </p>
      </aside>
    </>
  );
};

export default SkinSwitcher;
