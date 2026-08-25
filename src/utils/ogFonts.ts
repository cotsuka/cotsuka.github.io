import { fontData } from 'astro:assets';
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
  );

  if (!font?.weight || !font.style) {
    throw new Error(
      `Could not find font for ${cssVariable} with weight=${weight} and style=${style}`,
    );
  }

  const source = font.src.find((src) => src.format === 'woff');
  const assetUrl = source?.url;

  if (!assetUrl?.startsWith('/_astro/fonts/')) {
    throw new Error(
      `Could not find a WOFF Astro font URL for ${cssVariable} with weight=${weight} and style=${style}: ${JSON.stringify(font.src)}`,
    );
  }

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
  const buildPath = `dist${assetUrl}`;
  const buildFile = Bun.file(buildPath);

  if (await buildFile.exists()) {
    return buildFile.arrayBuffer();
  }

  const response = await fetch(new URL(assetUrl, siteOrigin));

  if (!response.ok) {
    throw new Error(
      `Failed to fetch Astro font asset: ${assetUrl} (${response.status} ${response.statusText})`,
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
