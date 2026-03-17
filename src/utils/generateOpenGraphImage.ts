import { fontData } from 'astro:assets';
import { ImageResponse } from '@vercel/og';
import type { Font } from 'satori';
import { siteAuthor } from '@utils/globals';

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

function createOgFonts(siteOrigin: string): Promise<Array<Font>> {
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

export default async function generateOpenGraphImage(
  title: string,
  description: string,
  siteOrigin: string,
) {
  return new ImageResponse(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#e6e2d6',
          color: '#000000',
          width: '100%',
          height: '100%',
          padding: 80,
          fontFamily: 'Public Sans',
        },
        children: [
          {
            type: 'h1',
            props: {
              style: {
                fontSize: 64,
                fontWeight: 700,
                marginBottom: 20,
              },
              children: title,
            },
          },
          {
            type: 'p',
            props: {
              style: {
                fontSize: 32,
                marginBottom: 40,
                fontFamily: 'Source Serif 4, DejaVu Mono',
              },
              children: description,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                marginTop: 'auto',
                textTransform: 'uppercase',
                fontSize: 20,
                letterSpacing: '0.1em',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      borderTop: '2px solid #82273d',
                      width: 240,
                      margin: '0 auto 8px',
                      display: 'flex',
                      textAlign: 'center',
                    },
                  },
                },
                siteAuthor.name,
              ],
            },
          },
        ],
      },
      key: null,
    },
    {
      width: 1200,
      height: 630,
      fonts: await createOgFonts(siteOrigin),
    },
  );
}
