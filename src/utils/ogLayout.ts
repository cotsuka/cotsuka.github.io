import { siteTitle } from '@utils/globals';

export type WrappedOgText = {
  text: string;
  lineCount: number;
};

export type ResolvedOgLayout = {
  headline: WrappedOgText;
  description: string | null;
  isReviewRating: boolean;
};

export const CONTENT_BLOCK = {
  x: 40,
  y: 12,
  width: 880,
  height: 320,
};
export const TITLE_FONT_SIZE = 60;
export const TITLE_MAX_WIDTH = 860;
export const TITLE_MAX_LINES = 4;
export const TITLE_LINE_HEIGHT = 1.05;
export const DESCRIPTION_FONT_SIZE = 28;
export const DESCRIPTION_MAX_WIDTH = 860;
export const DESCRIPTION_LINE_HEIGHT = 1.28;
export const MAX_DESCRIPTION_LINES = 2;
export const TITLE_DESCRIPTION_GAP = 28;

export function normalizeOgText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function countCharacters(value: string): number {
  return Array.from(value).length;
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

export function estimateCharsPerLine(
  fontSize: number,
  maxWidth: number,
): number {
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

export function estimateContentHeight(
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

function isReviewRatingDescription(value: string): boolean {
  return /^[★☆]{5}$/.test(value);
}

export function resolveOgLayout(
  title: string,
  description: string,
): ResolvedOgLayout {
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
