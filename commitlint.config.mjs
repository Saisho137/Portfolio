/** Conventional Commits: `type(scope): description`, description under 40 characters */
const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-max-length': [2, 'always', 39]
  }
};

export default config;
