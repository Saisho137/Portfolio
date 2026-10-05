import { beforeEach, describe, expect, it, vi } from 'vitest';

const { execFileSync, readFileSync } = vi.hoisted(() => ({
  execFileSync: vi.fn(),
  readFileSync: vi.fn()
}));
// Node built-ins are CommonJS: the mock needs the default export too
vi.mock('node:child_process', () => ({ execFileSync, default: { execFileSync } }));
vi.mock('node:fs', () => ({ readFileSync, default: { readFileSync } }));

const DATE = '2026-10-04T21:00:00-05:00';

// The result is cached per module: import a fresh copy in every test
const load = async () => (await import('./contentDate')).getContentUpdatedAt;

describe('getContentUpdatedAt', () => {
  beforeEach(() => {
    vi.resetModules();
    execFileSync.mockImplementation((_git: string, [command]: string[]) =>
      command === 'log' ? `abc123 ${DATE}\n` : '.git/shallow'
    );
    readFileSync.mockImplementation(() => {
      throw new Error('ENOENT');
    });
  });

  it('returns the date of the last commit that changed the profile files', async () => {
    const getContentUpdatedAt = await load();

    expect(getContentUpdatedAt()).toBe(DATE);
    expect(execFileSync).toHaveBeenCalledWith(
      'git',
      expect.arrayContaining(['log', '--', 'src/content/profile.en.json']),
      expect.anything()
    );
  });

  it('asks git only once per build', async () => {
    const getContentUpdatedAt = await load();

    getContentUpdatedAt();
    getContentUpdatedAt();

    expect(execFileSync.mock.calls.filter(([, [command]]) => command === 'log')).toHaveLength(1);
  });

  it('is unknown when that commit is the edge of a shallow clone (its date is not the change)', async () => {
    readFileSync.mockReturnValue('abc123\n');
    const getContentUpdatedAt = await load();

    expect(getContentUpdatedAt()).toBeUndefined();
  });

  it('is unknown without git or history', async () => {
    execFileSync.mockImplementation(() => {
      throw new Error('not a git repository');
    });
    const getContentUpdatedAt = await load();

    expect(getContentUpdatedAt()).toBeUndefined();
  });

  it('is unknown when no commit touched the files yet', async () => {
    execFileSync.mockReturnValue('');
    const getContentUpdatedAt = await load();

    expect(getContentUpdatedAt()).toBeUndefined();
  });
});
