import data from './profile.json';
import type { Profile, SectionId } from './types';

// Typing the JSON here makes `tsc` fail if profile.json drifts from the schema
export const profile: Profile = data;

// Shared by every skin so anchors behave the same regardless of the layout
export const SECTIONS: { id: SectionId; label: string }[] = [
  { id: 'about', label: 'about' },
  { id: 'work', label: 'work' },
  { id: 'experience', label: 'experience' },
  { id: 'skills', label: 'skills' },
  { id: 'contact', label: 'contact' }
];

export type * from './types';
