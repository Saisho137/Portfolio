import type { ComponentType } from 'react';

export type SkinId = 'raw-bw' | 'raw-color' | 'brutalist';
export type LazySkinId = Exclude<SkinId, 'raw-bw'>;

export const DEFAULT_SKIN = 'raw-bw' satisfies SkinId;

export const isLazySkin = (id: SkinId): id is LazySkinId => id !== DEFAULT_SKIN;

export const SKIN_LABELS: Record<SkinId, string> = {
  'raw-bw': 'Raw HTML, black and white',
  'raw-color': 'Raw HTML, color',
  brutalist: 'Brutalist'
};

/**
 * Dynamic imports = separate chunks (JS + CSS + fonts) that are only fetched
 * when called. The bundler caches each module after its first import().
 */
export const loaders: Record<LazySkinId, () => Promise<{ default: ComponentType }>> = {
  'raw-color': () => import('@/skins/raw-color/RawColorSkin'),
  brutalist: () => import('@/skins/brutalist/BrutalistSkin')
};

// Resolved components are handed to the switcher already loaded. Unlike React.lazy
// this never suspends, so the View Transition snapshot always contains the new skin.
const resolved = new Map<LazySkinId, ComponentType>();
const pending = new Map<LazySkinId, Promise<ComponentType>>();

export const loadSkin = (id: LazySkinId): Promise<ComponentType> => {
  const cached = resolved.get(id);
  if (cached) return Promise.resolve(cached);

  let request = pending.get(id);
  if (!request) {
    request = loaders[id]()
      .then((module) => {
        resolved.set(id, module.default);
        return module.default;
      })
      .finally(() => pending.delete(id));
    pending.set(id, request);
  }

  return request;
};

/** Test helper: forget every loaded skin */
export const resetSkinCache = () => {
  resolved.clear();
  pending.clear();
};
