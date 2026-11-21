export type Theme = 'light' | 'dark';
export type ThemeMode = Theme | 'system';

/** Apply the current theme immediately. Only System mode follows subsequent OS changes. */
export function watchTheme(mode: ThemeMode, system: MediaQueryList, apply: (theme: Theme) => void): () => void {
  if (mode !== 'system') {
    apply(mode);
    return () => {};
  }
  const update = () => apply(system.matches ? 'dark' : 'light');
  update();
  system.addEventListener('change', update);
  return () => system.removeEventListener('change', update);
}
