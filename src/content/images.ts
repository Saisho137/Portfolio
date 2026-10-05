import type { StaticImageData } from 'next/image';

import agendaComfama from '@/assets/images/projects/agenda-comfama.png';
import arka from '@/assets/images/projects/arka.png';
import portfolio from '@/assets/images/projects/portfolio.png';

/**
 * Static imports give next/image the intrinsic size, a blur placeholder and a
 * content-hashed file. profile.json references these by id.
 */
export const projectImages: Record<string, StaticImageData> = {
  'agenda-comfama': agendaComfama,
  arka,
  portfolio
};

export const getProjectImage = (id: string): StaticImageData => {
  const image = projectImages[id];

  // Fails the build (prerender) instead of shipping a broken image
  if (!image) throw new Error(`Unknown project image id: "${id}"`);

  return image;
};
