import type { ComponentType } from 'react';

import { loadProfile } from '@/content/loaders';
import type { Locale } from '@/i18n/config';
import { loadDictionary } from '@/i18n/loaders';
import type { SkinProps } from '@/skins/types';

export type SkinId = 'raw-bw' | 'raw-color' | 'brutalist';
export type LazySkinId = Exclude<SkinId, 'raw-bw'>;

export const DEFAULT_SKIN = 'raw-bw' satisfies SkinId;

export const isLazySkin = (id: SkinId): id is LazySkinId => id !== DEFAULT_SKIN;

/**
 * Dynamic imports = separate chunks (JS + CSS + fonts) that are only fetched
 * when called. The bundler caches each module after its first import().
 */
export const loaders: Record<LazySkinId, () => Promise<{ default: ComponentType<SkinProps> }>> = {
  'raw-color': () => import('@/skins/raw-color/RawColorSkin'),
  brutalist: () => import('@/skins/brutalist/BrutalistSkin')
};

/** A lazy skin ready to render: its component plus the content of one language */
export interface LoadedSkin {
  Component: ComponentType<SkinProps>;
  props: SkinProps;
}

// Resolved skins are handed to the switcher already loaded. Unlike React.lazy
// this never suspends, so the View Transition snapshot always contains the new skin.
const resolved = new Map<string, LoadedSkin>();
const pending = new Map<string, Promise<LoadedSkin>>();
// Bumped by resetSkinCache so requests started before a reset can't refill the cache
let generation = 0;

/** Skin chunk, profile and dictionary in parallel; only the active language is fetched */
export const loadSkin = (id: LazySkinId, lang: Locale): Promise<LoadedSkin> => {
  const key = `${id}:${lang}`;
  const cached = resolved.get(key);
  if (cached) return Promise.resolve(cached);

  let request = pending.get(key);
  if (!request) {
    const requestGeneration = generation;
    const isCurrent = () => requestGeneration === generation;

    request = Promise.all([loaders[id](), loadProfile(lang), loadDictionary(lang)])
      .then(([module, profile, dict]) => {
        const skin = { Component: module.default, props: { profile, dict, lang } };
        if (isCurrent()) resolved.set(key, skin);
        return skin;
      })
      .finally(() => {
        if (isCurrent()) pending.delete(key);
      });
    pending.set(key, request);
  }

  return request;
};

/** Test helper: forget every loaded skin */
export const resetSkinCache = () => {
  generation += 1;
  resolved.clear();
  pending.clear();
};
