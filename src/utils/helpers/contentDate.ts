import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

/** The page content: a change here is a change to what the page says */
const CONTENT_FILES = ['src/content/profile.en.json', 'src/content/profile.es.json'];

const git = (...args: string[]) =>
  execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();

/** Commits at the edge of a shallow clone: git shows them as adding every file */
const shallowBoundary = (): string[] => {
  try {
    return readFileSync(git('rev-parse', '--git-path', 'shallow'), 'utf8').split('\n');
  } catch {
    return []; // full clone: no shallow file
  }
};

let cached: string | null | undefined;

/**
 * Date (ISO 8601) of the last commit that changed the profile content, read from git at
 * build time. Unknown (undefined) without git or when that commit is beyond a shallow
 * clone: no date is better than the build date, which would change on every deploy.
 */
export const getContentUpdatedAt = (): string | undefined => {
  if (cached === undefined) {
    try {
      const [hash = '', date = ''] = git(
        'log',
        '-1',
        '--format=%H %cI',
        '--',
        ...CONTENT_FILES
      ).split(' ');
      cached = date && !shallowBoundary().includes(hash) ? date : null;
    } catch {
      cached = null;
    }
  }

  return cached ?? undefined;
};
