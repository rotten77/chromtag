import { expect, it } from 'vitest';
import { appearanceFrom } from './appearance-settings';
import { contrastRatio, hasGoodContrast } from './color-contrast';
import { families } from './material-colors';

it('keeps default light and dark text, chips, hover, and selection above normal-text contrast', () => {
  const defaults = appearanceFrom(null);
  for (const theme of ['light', 'dark'] as const) {
    for (const role of ['text', 'tag', 'folder', 'highlight', 'selection'] as const) {
      expect(hasGoodContrast(theme, role, defaults[theme][role]), `${theme} ${role}`).toBe(true);
    }
  }
  expect(contrastRatio('#2E7D32', '#FFFFFF')).toBeGreaterThanOrEqual(4.5);
  expect(contrastRatio('#388E3C', '#FFFFFF')).toBeLessThan(4.5);
  expect(contrastRatio('#9E9E9E', '#212121')).toBeGreaterThanOrEqual(4.5);
});

it('offers only shades with sufficient text contrast for each theme and role', () => {
  const shades = families.flatMap(family => family.shades.map(shade => shade.hex));
  for (const theme of ['light', 'dark'] as const) {
    for (const role of ['text', 'tag', 'folder', 'highlight', 'selection'] as const) {
      const selectable = shades.filter(shade => hasGoodContrast(theme, role, shade));
      expect(selectable.length, `${theme} ${role}`).toBeGreaterThan(0);
      expect(selectable.length, `${theme} ${role}`).toBeLessThan(shades.length);
      for (const shade of selectable) {
        const foreground = role === 'text' ? theme === 'light' ? '#FFFFFF' : '#212121'
          : role === 'tag' || role === 'folder' ? theme === 'light' ? '#FFFFFF' : '#212121' : '#FFFFFF';
        expect(contrastRatio(shade, foreground), `${theme} ${role}: ${shade}`).toBeGreaterThanOrEqual(4.5);
      }
    }
  }
  expect(hasGoodContrast('light', 'folder', '#A5D6A7')).toBe(false);
  expect(hasGoodContrast('dark', 'folder', '#B388FF')).toBe(true);
  expect(hasGoodContrast('light', 'tag', '#512DA8')).toBe(true);
});

it('rejects previously saved low-contrast shades without changing other settings', () => {
  const saved = appearanceFrom({ width: 640, mode: 'dark', light: { folder: '#388E3C', text: '#FFFFFF', tag: '#512DA8' },
    dark: { text: '#212121', folder: '#B388FF', highlight: '#90CAF9', selection: '#FFFFFF' } });
  expect(saved).toMatchObject({ width: 640, mode: 'dark', light: { folder: '#2E7D32', text: '#222B38', tag: '#512DA8' },
    dark: { text: '#FAFAFA', folder: '#B388FF', highlight: '#424242', selection: '#D32F2F' } });
});
