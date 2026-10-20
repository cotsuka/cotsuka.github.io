import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import type { Font } from 'satori';

/** Keep flags, skin tones, keycaps, and joined emoji together. */
export function getEmojiGraphemes(text: string): string[] {
  const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
  return [
    ...new Set(
      [...segmenter.segment(text)]
        .map(({ segment }) => segment)
        .filter((segment) =>
          /\p{Emoji_Presentation}|\uFE0F|\u20E3/u.test(segment),
        ),
    ),
  ];
}

/** Use the full Astro-managed font, not a list of per-emoji image assets. */
export async function createOgEmojiImages(
  text: string,
  fonts: Font[],
): Promise<Record<string, string>> {
  const emojis = getEmojiGraphemes(text);
  if (emojis.length === 0) return {};

  const font = fonts.find(({ name }) => name === 'Noto Emoji')!;

  // Pango needs a font file to shape sequences; Satori alone does not join them.
  const directory = await mkdtemp(join(tmpdir(), 'cotsuka-og-emoji-'));
  try {
    const fontfile = join(directory, 'noto-emoji.ttf');
    await writeFile(
      fontfile,
      Buffer.isBuffer(font.data) ? font.data : Buffer.from(font.data),
    );
    return Object.fromEntries(
      await Promise.all(
        emojis.map(async (emoji) => {
          // Use monochrome glyphs, not system color-font fallbacks.
          const markup = emoji
            .replaceAll('\uFE0F', '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;');
          const png = await sharp({
            text: {
              text: `<span fallback="false">${markup}</span>`,
              font: 'Noto Emoji 128',
              fontfile,
              rgba: true,
            },
          })
            .png()
            .toBuffer();
          return [emoji, `data:image/png;base64,${png.toString('base64')}`];
        }),
      ),
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}
