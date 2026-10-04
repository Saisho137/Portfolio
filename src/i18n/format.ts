/** Fills `{key}` placeholders: `format('Style: {skin}', { skin: 'Brutalist' })` */
export const format = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);

/** `2026-03` → `Mar 2026` / `mar 2026`. UTC so the month never shifts with the time zone */
export const formatYearMonth = (yearMonth: string, lang: string) =>
  new Intl.DateTimeFormat(lang, { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${yearMonth}-01T00:00:00Z`)
  );

/** `Mar 2026 — now`; an open period ends with the label of the current position */
export const formatPeriod = (
  { start, end }: { start?: string; end?: string },
  lang: string,
  current: string
) =>
  [start && formatYearMonth(start, lang), end ? formatYearMonth(end, lang) : current]
    .filter(Boolean)
    .join(' — ');
