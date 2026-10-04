/** Fills `{key}` placeholders: `format('Style: {skin}', { skin: 'Brutalist' })` */
export const format = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
