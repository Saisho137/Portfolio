export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme';

export const isTheme = (value: unknown): value is Theme => value === 'light' || value === 'dark';

/**
 * Runs in <head> before first paint: applies the stored theme so there is no flash
 * of the wrong scheme. Without a stored value (or without JS) the OS preference rules.
 * Kept as a plain string because it must run before React and the bundle load.
 */
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;
