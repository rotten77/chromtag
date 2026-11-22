export type ColorTheme = 'light' | 'dark';
export type ColorRole = 'text' | 'tag' | 'folder' | 'highlight' | 'selection';

const background: Record<ColorTheme, string> = { light: '#FFFFFF', dark: '#212121' };
const chipText: Record<ColorTheme, string> = { light: '#FFFFFF', dark: '#212121' };
const white = '#FFFFFF';
const minTextContrast = 4.5;

function luminance(hex: string): number {
  const [red, green, blue] = [1, 3, 5].map(offset => {
    const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function contrastRatio(first: string, second: string): number {
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/** Check normal-size text on each fixed surface that a role can affect. */
export function hasGoodContrast(theme: ColorTheme, role: ColorRole, shade: string): boolean {
  if (role === 'text') return contrastRatio(shade, background[theme]) >= minTextContrast;
  if (role === 'tag' || role === 'folder') return contrastRatio(shade, chipText[theme]) >= minTextContrast;
  // Hovered and selected chips use white labels in both themes.
  return contrastRatio(shade, white) >= minTextContrast;
}
