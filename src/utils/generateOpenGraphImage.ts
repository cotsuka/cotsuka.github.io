import { fontData } from 'astro:assets';
import { ImageResponse } from '@vercel/og';
import type { Font } from 'satori';
import { siteAuthor, siteTitle } from '@utils/globals';

type ResolvedOgFont = {
  name: string;
  assetUrl: string;
  weight: Font['weight'];
  style: Font['style'];
};

type WrappedOgText = {
  text: string;
  lineCount: number;
};

type ResolvedOgLayout = {
  headline: WrappedOgText;
  description: string | null;
  isReviewRating: boolean;
};

const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;
const SAFE_TEXT_ZONE = {
  x: 120,
  y: Math.round((OG_IMAGE_HEIGHT - 460) / 2),
  width: 960,
  height: 460,
};
const CONTENT_BLOCK = {
  x: 40,
  y: 12,
  width: 880,
  height: 320,
};
const BRAND_BLOCK = {
  x: 360,
  y: 382,
  width: 240,
  height: 46,
};
const BACKGROUND_COLOR = '#e6e2d6';
const TEXT_COLOR = '#000000';
const ACCENT_COLOR = '#82273d';
const TITLE_FONT_SIZE = 60;
const TITLE_MAX_WIDTH = 860;
const TITLE_MAX_LINES = 4;
const TITLE_LINE_HEIGHT = 1.05;
const DESCRIPTION_FONT_SIZE = 28;
const DESCRIPTION_MAX_WIDTH = 860;
const DESCRIPTION_LINE_HEIGHT = 1.28;
const MAX_DESCRIPTION_LINES = 2;
const TITLE_DESCRIPTION_GAP = 28;

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

function normalizeOgText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function countCharacters(value: string): number {
  return Array.from(value).length;
}

function isReviewRatingDescription(value: string): boolean {
  return /^[★☆]{5}$/.test(value);
}

function trimToLength(value: string, maxLength: number): string {
  if (countCharacters(value) <= maxLength) {
    return value;
  }

  const characters = Array.from(value)
    .slice(0, maxLength - 1)
    .join('');

  return `${characters.trimEnd()}…`;
}

function estimateCharsPerLine(fontSize: number, maxWidth: number): number {
  return Math.max(12, Math.floor(maxWidth / (fontSize * 0.54)));
}

function wrapTextIntoLines(value: string, maxCharsPerLine: number): string[] {
  const normalized = normalizeOgText(value);

  if (!normalized) {
    return [];
  }

  const words = normalized.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;

    if (!currentLine || countCharacters(candidate) <= maxCharsPerLine) {
      currentLine = candidate;
      continue;
    }

    lines.push(currentLine);
    currentLine = word;
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function formatTextToMaxLines(
  value: string,
  maxCharsPerLine: number,
  maxLines: number,
): WrappedOgText {
  const lines = wrapTextIntoLines(value, maxCharsPerLine);

  if (lines.length <= maxLines) {
    return {
      text: lines.join('\n'),
      lineCount: lines.length,
    };
  }

  const truncatedLines = lines.slice(0, maxLines);
  truncatedLines[maxLines - 1] = trimToLength(
    truncatedLines[maxLines - 1],
    maxCharsPerLine,
  );

  if (!truncatedLines[maxLines - 1].endsWith('…')) {
    truncatedLines[maxLines - 1] = `${truncatedLines[maxLines - 1].trimEnd()}…`;
  }

  return {
    text: truncatedLines.join('\n'),
    lineCount: truncatedLines.length,
  };
}

function estimateContentHeight(
  headlineLineCount: number,
  descriptionLineCount: number,
  descriptionFontSize = DESCRIPTION_FONT_SIZE,
  descriptionLineHeight = DESCRIPTION_LINE_HEIGHT,
): number {
  let height = headlineLineCount * TITLE_FONT_SIZE * TITLE_LINE_HEIGHT;

  if (descriptionLineCount > 0) {
    height +=
      TITLE_DESCRIPTION_GAP +
      descriptionLineCount * descriptionFontSize * descriptionLineHeight;
  }

  return Math.ceil(height);
}

function resolveOgLayout(title: string, description: string): ResolvedOgLayout {
  const normalizedTitle = normalizeOgText(title) || siteTitle;
  const normalizedDescription = normalizeOgText(description);
  const headline = formatTextToMaxLines(
    normalizedTitle,
    estimateCharsPerLine(TITLE_FONT_SIZE, TITLE_MAX_WIDTH),
    TITLE_MAX_LINES,
  );

  if (!normalizedDescription) {
    return { headline, description: null, isReviewRating: false };
  }

  if (isReviewRatingDescription(normalizedDescription)) {
    if (
      estimateContentHeight(
        headline.lineCount,
        1,
        TITLE_FONT_SIZE,
        TITLE_LINE_HEIGHT,
      ) <= CONTENT_BLOCK.height
    ) {
      return {
        headline,
        description: normalizedDescription,
        isReviewRating: true,
      };
    }

    return {
      headline,
      description: null,
      isReviewRating: true,
    };
  }

  if (
    estimateContentHeight(headline.lineCount, MAX_DESCRIPTION_LINES) <=
    CONTENT_BLOCK.height
  ) {
    return {
      headline,
      description: normalizedDescription,
      isReviewRating: false,
    };
  }

  return {
    headline,
    description: null,
    isReviewRating: false,
  };
}

export default async function generateOpenGraphImage(
  title: string,
  description: string,
  siteOrigin: string,
) {
  const layout = resolveOgLayout(title, description);

  return new ImageResponse(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          position: 'relative',
          backgroundColor: BACKGROUND_COLOR,
          color: TEXT_COLOR,
          width: '100%',
          height: '100%',
          fontFamily: 'Public Sans',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                left: SAFE_TEXT_ZONE.x,
                top: SAFE_TEXT_ZONE.y,
                width: SAFE_TEXT_ZONE.width,
                height: SAFE_TEXT_ZONE.height,
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      position: 'absolute',
                      left: CONTENT_BLOCK.x,
                      top: CONTENT_BLOCK.y,
                      width: CONTENT_BLOCK.width,
                      height: CONTENT_BLOCK.height,
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                      textAlign: 'left',
                    },
                    children: [
                      {
                        type: 'h1',
                        props: {
                          style: {
                            margin: 0,
                            maxWidth: TITLE_MAX_WIDTH,
                            fontSize: TITLE_FONT_SIZE,
                            fontWeight: 700,
                            lineHeight: TITLE_LINE_HEIGHT,
                            letterSpacing: '-0.04em',
                            whiteSpace: 'pre-wrap',
                          },
                          children: layout.headline.text,
                        },
                      },
                      ...(layout.description
                        ? layout.isReviewRating
                          ? [
                              {
                                type: 'div',
                                props: {
                                  style: {
                                    display: 'flex',
                                    width: '100%',
                                    justifyContent: 'center',
                                    marginTop: TITLE_DESCRIPTION_GAP,
                                  },
                                  children: [
                                    {
                                      type: 'p',
                                      props: {
                                        style: {
                                          margin: 0,
                                          fontSize: TITLE_FONT_SIZE,
                                          fontWeight: 700,
                                          lineHeight: TITLE_LINE_HEIGHT,
                                          textAlign: 'center',
                                        },
                                        children: layout.description,
                                      },
                                    },
                                  ],
                                },
                              },
                            ]
                          : [
                              {
                                type: 'p',
                                props: {
                                  style: {
                                    margin: `${TITLE_DESCRIPTION_GAP}px 0 0`,
                                    maxWidth: DESCRIPTION_MAX_WIDTH,
                                    fontSize: DESCRIPTION_FONT_SIZE,
                                    lineHeight: DESCRIPTION_LINE_HEIGHT,
                                    fontFamily: 'Source Serif 4, DejaVu Mono',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    lineClamp: MAX_DESCRIPTION_LINES,
                                  },
                                  children: layout.description,
                                },
                              },
                            ]
                        : []),
                    ],
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      position: 'absolute',
                      left: BRAND_BLOCK.x,
                      top: BRAND_BLOCK.y,
                      width: BRAND_BLOCK.width,
                      height: BRAND_BLOCK.height,
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textTransform: 'uppercase',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            borderTop: `2px solid ${ACCENT_COLOR}`,
                            width: BRAND_BLOCK.width,
                            marginBottom: 8,
                          },
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontSize: 20,
                            letterSpacing: '0.1em',
                          },
                          children: siteAuthor.name,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
      key: null,
    },
    {
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
      fonts: await createOgFonts(siteOrigin),
    },
  );
}
