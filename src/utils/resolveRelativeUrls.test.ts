import { describe, expect, test } from 'bun:test';
import resolveRelativeUrls from './resolveRelativeUrls';

const itemUrl = new URL('https://example.com/articles/post/');

describe('resolveRelativeUrls', () => {
  test('resolves root-relative href and src attributes', () => {
    const html = `<a href="/articles/related/"><img src='/_astro/image.png' alt="Image"></a>`;

    expect(resolveRelativeUrls(html, itemUrl)).toBe(
      '<a href="https://example.com/articles/related/"><img src="https://example.com/_astro/image.png" alt="Image"></a>',
    );
  });

  test('resolves document-relative URLs against the item URL', () => {
    const html =
      '<a href="../related/">Related</a><img src="images/image.png"><a href="#section">Section</a>';

    expect(resolveRelativeUrls(html, itemUrl)).toBe(
      '<a href="https://example.com/articles/related/">Related</a><img src="https://example.com/articles/post/images/image.png"><a href="https://example.com/articles/post/#section">Section</a>',
    );
  });

  test('resolves every relative srcset candidate', () => {
    const html =
      '<img srcset="images/small.webp 640w, ../large.webp 1280w, /_astro/fallback.webp 2x">';

    expect(resolveRelativeUrls(html, itemUrl)).toBe(
      '<img srcset="https://example.com/articles/post/images/small.webp 640w, https://example.com/articles/large.webp 1280w, https://example.com/_astro/fallback.webp 2x">',
    );
  });

  test('does not treat a data URL comma as a srcset separator', () => {
    const html =
      '<img srcset="data:image/svg+xml,/icon.svg 1x, images/image.webp 2x">';

    expect(resolveRelativeUrls(html, itemUrl)).toBe(
      '<img srcset="data:image/svg+xml,/icon.svg 1x, https://example.com/articles/post/images/image.webp 2x">',
    );
  });

  test('parses attributes instead of matching HTML-like text', () => {
    const html =
      '<img alt="comparison: 1 > 0" src=images/image.png><code>href="relative/"</code>';

    expect(resolveRelativeUrls(html, itemUrl)).toBe(
      '<img alt="comparison: 1 > 0" src="https://example.com/articles/post/images/image.png"><code>href="relative/"</code>',
    );
  });

  test('preserves absolute URLs and resolves protocol-relative URLs', () => {
    const html =
      '<a href="https://external.example/path">External</a><a href="mailto:test@example.com">Email</a><img src="//cdn.example.com/image.png">';

    expect(resolveRelativeUrls(html, itemUrl)).toBe(
      '<a href="https://external.example/path">External</a><a href="mailto:test@example.com">Email</a><img src="https://cdn.example.com/image.png">',
    );
  });
});
