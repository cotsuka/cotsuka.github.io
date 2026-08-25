import { describe, expect, test } from 'bun:test';
import {
  CONTENT_BLOCK,
  estimateCharsPerLine,
  estimateContentHeight,
  normalizeOgText,
  resolveOgLayout,
  TITLE_FONT_SIZE,
  TITLE_MAX_LINES,
} from '@utils/ogLayout';

describe('normalizeOgText', () => {
  test('collapses whitespace and trims ends', () => {
    expect(normalizeOgText('  a \n\t b   c ')).toBe('a b c');
  });

  test('empty input stays empty', () => {
    expect(normalizeOgText('   ')).toBe('');
  });
});

describe('estimateCharsPerLine', () => {
  test('scales inversely with font size', () => {
    const wide = estimateCharsPerLine(28, 860);
    const narrow = estimateCharsPerLine(60, 860);
    expect(wide).toBeGreaterThan(narrow);
    expect(narrow).toBeGreaterThanOrEqual(12);
  });
});

describe('estimateContentHeight', () => {
  test('adds gap only when description lines exist', () => {
    const withoutDescription = estimateContentHeight(1, 0);
    const withDescription = estimateContentHeight(1, 2);
    expect(withDescription).toBeGreaterThan(withoutDescription);
  });
});

describe('resolveOgLayout', () => {
  test('falls back to site title when title is blank', () => {
    const { headline } = resolveOgLayout('   ', '');
    expect(headline.text.length).toBeGreaterThan(0);
  });

  test('caps headline at the maximum line count', () => {
    const longTitle = 'word '.repeat(100).trim();
    const { headline } = resolveOgLayout(longTitle, '');
    expect(headline.lineCount).toBeLessThanOrEqual(TITLE_MAX_LINES);
    expect(headline.text.endsWith('…')).toBe(true);
  });

  test('drops descriptions that would overflow the content block', () => {
    const longTitle = 'word '.repeat(100).trim();
    const layout = resolveOgLayout(longTitle, 'A short description.');
    expect(layout.description).toBeNull();

    const fits = resolveOgLayout('Short title', 'A short description.');
    expect(fits.description).toBe('A short description.');
    expect(fits.isReviewRating).toBe(false);
  });

  test('detects five-star review ratings', () => {
    const layout = resolveOgLayout('Some Book', '★★★☆☆');
    expect(layout.isReviewRating).toBe(true);
    expect(layout.description).toBe('★★★☆☆');
  });

  test('drops star ratings when the headline fills the block', () => {
    const longTitle = 'word '.repeat(100).trim();
    const layout = resolveOgLayout(longTitle, '★★★☆☆');
    expect(layout.isReviewRating).toBe(true);
    expect(layout.description).toBeNull();
  });

  test('headline always fits within the content block height budget', () => {
    const longTitle = 'word '.repeat(200).trim();
    const { headline } = resolveOgLayout(longTitle, '');
    const height = estimateContentHeight(headline.lineCount, 0);
    expect(height).toBeLessThanOrEqual(CONTENT_BLOCK.height);
    expect(TITLE_FONT_SIZE).toBeGreaterThan(0);
  });
});
