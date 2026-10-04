export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme';

/** Browser UI tint per theme, matching the default (raw-bw) skin background */
export const THEME_COLORS: Record<Theme, string> = { light: '#f2f2f0', dark: '#0b0b0b' };

export const isTheme = (value: unknown): value is Theme => value === 'light' || value === 'dark';

const MANUAL_THEME_COLOR_ID = 'theme-color-manual';

/**
 * The <meta name="theme-color"> tags from the viewport config follow the OS through
 * their `media` queries, and React owns them (editing them makes hydration add copies).
 * A manual choice goes in a separate meta without `media`, first in <head>: browsers
 * use the first theme-color that matches, so it wins over the OS ones.
 */
export const syncThemeColor = (theme: Theme) => {
  let meta = document.getElementById(MANUAL_THEME_COLOR_ID) as HTMLMetaElement | null;

  if (!meta) {
    meta = document.createElement('meta');
    meta.id = MANUAL_THEME_COLOR_ID;
    meta.name = 'theme-color';
  }
  meta.content = THEME_COLORS[theme];
  document.head.prepend(meta);
};

/**
 * Runs in <head> before first paint: applies the stored theme (and its theme-color,
 * like syncThemeColor) so there is no flash of the wrong scheme. Without a stored value
 * (or without JS) the OS preference rules. Kept as a plain string because it must run
 * before React and the bundle load.
 */
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='light'||t==='dark'){var d=document,m=d.createElement('meta');d.documentElement.dataset.theme=t;m.id='${MANUAL_THEME_COLOR_ID}';m.name='theme-color';m.content=${JSON.stringify(THEME_COLORS)}[t];d.head.prepend(m)}}catch(e){}`;
