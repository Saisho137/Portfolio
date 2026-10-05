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
  /** Achievements, one sentence each */
  highlights?: string[];
}

export interface Education {
  institution: string;
  url?: string;
  degree?: string;
  /** Graduation, `YYYY-MM` */
  end?: string;
  honors?: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  /** Issue date, `YYYY-MM` */
  date: string;
  /** Public verification page (Credly) */
  url?: string;
}

export interface Language {
  /** BCP 47 */
  code: string;
  name: string;
  level: string;
}

/** Skills by area. Tool names stay as they are; categories and concepts are translated */
export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Profile {
  name: string;
  role: string;
  summary: string;
  /** City and country, also the JSON-LD homeLocation */
  location: {
    city: string;
    country: string;
    /** ISO 3166-1 alpha-2 */
    countryCode: string;
  };
  about: string[];
  links: {
    github: string;
    linkedin: string;
    email?: string;
  };
  projects: Project[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  languages: Language[];
  skills: SkillGroup[];
}

export type SectionId = 'about' | 'work' | 'experience' | 'skills' | 'contact';
