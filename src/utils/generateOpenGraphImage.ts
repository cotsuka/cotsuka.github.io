import { ImageResponse } from '@vercel/og';
import { siteAuthor } from '@utils/globals';
import {
  CONTENT_BLOCK,
  DESCRIPTION_FONT_SIZE,
  DESCRIPTION_LINE_HEIGHT,
  DESCRIPTION_MAX_WIDTH,
  MAX_DESCRIPTION_LINES,
  TITLE_DESCRIPTION_GAP,
  TITLE_FONT_SIZE,
  TITLE_LINE_HEIGHT,
  resolveOgLayout,
} from '@utils/ogLayout';
import { createOgFonts } from '@utils/ogFonts';

const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;
const SAFE_TEXT_ZONE = {
  x: 120,
  y: 85,
  width: 960,
  height: 460,
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

type OgStyle = Record<string, string | number>;

type OgElement = {
  type: string;
  props: {
    style?: OgStyle;
    children?: OgElement | OgElement[] | string;
    [key: string]: unknown;
  };
};

function el(
  type: string,
  style: OgStyle,
  children: OgElement | OgElement[] | string = '',
): OgElement {
  return { type, props: { style, children, key: null } };
}

export default async function generateOpenGraphImage(
  title: string,
  description: string,
  siteOrigin: string,
) {
  const layout = resolveOgLayout(title, description);

  const headline = el(
    'h1',
    {
      margin: 0,
      maxWidth: 860,
      fontSize: TITLE_FONT_SIZE,
      fontWeight: 700,
      lineHeight: TITLE_LINE_HEIGHT,
      letterSpacing: '-0.04em',
      whiteSpace: 'pre-wrap',
    },
    layout.headline.text,
  );

  const ratingDescription = el(
    'div',
    {
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      marginTop: TITLE_DESCRIPTION_GAP,
    },
    el(
      'p',
      {
        margin: 0,
        fontSize: TITLE_FONT_SIZE,
        fontWeight: 700,
        lineHeight: TITLE_LINE_HEIGHT,
        textAlign: 'center',
      },
      layout.description ?? '',
    ),
  );

  const textDescription = el(
    'p',
    {
      margin: `${TITLE_DESCRIPTION_GAP}px 0 0`,
      maxWidth: DESCRIPTION_MAX_WIDTH,
      fontSize: DESCRIPTION_FONT_SIZE,
      lineHeight: DESCRIPTION_LINE_HEIGHT,
      fontFamily: 'Source Serif 4, DejaVu Mono',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      lineClamp: MAX_DESCRIPTION_LINES,
    },
    layout.description ?? '',
  );

  const contentBlock = el(
    'div',
    {
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
    [
      headline,
      ...(layout.description
        ? [layout.isReviewRating ? ratingDescription : textDescription]
        : []),
    ],
  );

  const brandBlock = el(
    'div',
    {
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
    [
      el('div', {
        borderTop: `2px solid ${ACCENT_COLOR}`,
        width: BRAND_BLOCK.width,
        marginBottom: 8,
      }),
      el('div', { fontSize: 20, letterSpacing: '0.1em' }, siteAuthor.name),
    ],
  );

  const safeZone = el(
    'div',
    {
      display: 'flex',
      position: 'absolute',
      left: SAFE_TEXT_ZONE.x,
      top: SAFE_TEXT_ZONE.y,
      width: SAFE_TEXT_ZONE.width,
      height: SAFE_TEXT_ZONE.height,
    },
    [contentBlock, brandBlock],
  );

  const root = el(
    'div',
    {
      display: 'flex',
      position: 'relative',
      backgroundColor: BACKGROUND_COLOR,
      color: TEXT_COLOR,
      width: '100%',
      height: '100%',
      fontFamily: 'Public Sans',
    },
    safeZone,
  );

  return new ImageResponse(root, {
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    fonts: await createOgFonts(siteOrigin),
  });
}
