'use client';

import { sendGTMEvent } from '@next/third-parties/google';
import { ComponentType, FC, ReactNode, useState } from 'react';
import { flushSync } from 'react-dom';

import { ThemeToggle } from '@/components/ThemeToggle';

import { BrushIcon, CodeBwIcon, CodeColorIcon } from './icons';
import { DEFAULT_SKIN, isLazySkin, loadSkin, SKIN_LABELS, type SkinId } from './skins';

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
}

const SkinSwitcher: FC<SkinSwitcherProps> = ({ children }) => {
  // Component is only set for lazy skins; raw-bw is always `children`
  const [skin, setSkin] = useState<{ id: SkinId; Component?: ComponentType }>({
    id: DEFAULT_SKIN
  });
  const [announcement, setAnnouncement] = useState('');

  // Prefetch on intent: hover (desktop), focus (keyboard), touchstart (mobile, no hover)
  const prefetch = (id: SkinId) => {
    if (isLazySkin(id)) loadSkin(id).catch(() => undefined);
  };

  const select = async (id: SkinId) => {
    if (id === skin.id) return;

    let Component: ComponentType | undefined;
    try {
      // Usually resolved already thanks to the prefetch
      if (isLazySkin(id)) Component = await loadSkin(id);
    } catch {
      return; // offline or chunk error: keep the current skin
    }

    const apply = () => {
      setSkin({ id, Component });
      setAnnouncement(`Style: ${SKIN_LABELS[id]}`);
    };

    if (typeof document.startViewTransition === 'function' && !prefersReducedMotion()) {
      // flushSync so the transition snapshots the new DOM synchronously
      document.startViewTransition(() => flushSync(apply));
    } else {
      apply();
    }

    sendGTMEvent({ event: 'skin_change', skin: id });
  };

  const { Component } = skin;

  return (
    <>
      {Component ? <Component /> : children}

      {/* Landmark so the controls aren't orphan content (axe `region`) */}
      <aside className={styles.toolbar} aria-label='Page settings'>
        <fieldset className={styles.switcher}>
          <legend className='visually-hidden'>Page style</legend>
          {OPTIONS.map(({ id, Icon }) => (
            <label
              key={id}
              className={styles.option}
              title={SKIN_LABELS[id]}
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
              <span className='visually-hidden'>{SKIN_LABELS[id]}</span>
            </label>
          ))}
        </fieldset>
        <ThemeToggle />
        <p className='visually-hidden' aria-live='polite'>
          {announcement}
        </p>
      </aside>
    </>
  );
};

export default SkinSwitcher;
