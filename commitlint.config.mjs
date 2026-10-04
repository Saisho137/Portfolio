/** Conventional Commits: `type(scope): description`, description under 40 characters */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-max-length': [2, 'always', 39]
  }
};
