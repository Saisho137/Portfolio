/** `id` must exist in `projectImages` (src/content/images.ts) */
export interface ImageRef {
  id: string;
  alt: string;
}

export interface Project {
  name: string;
  description?: string;
  url?: string;
  image?: ImageRef;
  tags?: string[];
}

export interface Experience {
  role: string;
  company: string;
  url?: string;
  /** Year and month, `YYYY-MM`: language-neutral, each skin formats it with Intl */
  start?: string;
  /** `YYYY-MM`; missing = current position */
  end?: string;
}

export interface Education {
  institution: string;
  url?: string;
  degree?: string;
}

export interface Profile {
  name: string;
  role: string;
  summary: string;
  about: string[];
  links: {
    github: string;
    linkedin: string;
    email?: string;
  };
  projects: Project[];
  experience: Experience[];
  education: Education[];
  skills: string[];
}

export type SectionId = 'about' | 'work' | 'experience' | 'skills' | 'contact';
