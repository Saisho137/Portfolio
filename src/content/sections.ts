import type { SectionId } from './types';

// Shared by every skin so anchors behave the same regardless of layout and language.
// Kept apart from index.ts so client skins can import it without the profile JSONs.
export const SECTION_IDS: SectionId[] = ['about', 'work', 'experience', 'skills', 'contact'];
