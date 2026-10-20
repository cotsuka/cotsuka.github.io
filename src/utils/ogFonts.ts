import { fontData, experimental_getFontFileURL } from 'astro:assets';
import type { Font } from 'satori';

type ResolvedOgFont = {
  name: string;
  assetUrl: string;
  weight: Font['weight'];
  style: Font['style'];
};

function getAstroFontVariant(
  name: string,
  cssVariable: keyof typeof fontData,
  weight: string,
  style: string,
): ResolvedOgFont {
  const font = fontData[cssVariable].find(
    (font) => font.weight === weight && font.style === style,
  )!;
  const assetUrl = font.src.find(
    (src) => src.format === 'woff' || src.format === 'truetype',
  )!.url;

  return {
    name,
    assetUrl,
    weight: Number(font.weight) as Font['weight'],
    style: font.style as Font['style'],
  };
}

async function loadAstroFontData(
  assetUrl: string,
  siteOrigin: string,
): Promise<ArrayBuffer> {
  // Astro resolves its font server in dev and during static builds.
  const fontUrl = experimental_getFontFileURL(assetUrl, new URL(siteOrigin));
  const response = await fetch(fontUrl);
  if (!response.ok) {
    throw new Error(
      `Font request failed: HTTP ${response.status} (${assetUrl})`,
    );
  }

  return response.arrayBuffer();
}

export function createOgFonts(siteOrigin: string): Promise<Array<Font>> {
  const variants = [
    getAstroFontVariant('Public Sans', '--font-sans', '400', 'normal'),
    getAstroFontVariant('Public Sans', '--font-sans', '700', 'normal'),
    getAstroFontVariant('Source Serif 4', '--font-serif', '400', 'normal'),
    getAstroFontVariant('DejaVu Mono', '--font-fallback', '400', 'normal'),
    getAstroFontVariant('Noto Emoji', '--font-emoji', '400', 'normal'),
  ];

  return Promise.all(
    variants.map(async (font) => ({
      name: font.name,
      data: await loadAstroFontData(font.assetUrl, siteOrigin),
      weight: font.weight,
      style: font.style,
    })),
  );
}
