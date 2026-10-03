export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Project {
  name: string;
  description?: string;
  url?: string;
  image?: ImageAsset;
  tags?: string[];
}

export interface Experience {
  role: string;
  company: string;
  url?: string;
  start?: string;
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
  photo: ImageAsset;
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
