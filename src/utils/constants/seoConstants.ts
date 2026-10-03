import { profile } from '@/content';

const [currentJob] = profile.experience;
const [university] = profile.education;

export const SITE_URL = 'https://portfolio-six-blond-30.vercel.app';
export const SITE_NAME = `Portfolio | ${profile.name}`;
export const SITE_DESCRIPTION = profile.summary;
export const GTM_ID = 'GTM-KH8PJXT6';
export const PROFILE_IMAGE = `${SITE_URL}${profile.photo.src}`;

export const AUTHOR = {
  name: profile.name,
  jobTitle: profile.role,
  github: profile.links.github,
  linkedin: profile.links.linkedin,
  skills: profile.skills,
  company: {
    name: currentJob.company,
    url: currentJob.url
  },
  university: {
    name: university.institution,
    url: university.url
  }
};
