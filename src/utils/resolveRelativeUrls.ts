import { ELEMENT_NODE, renderSync, walkSync, type Node } from 'ultrahtml';
import { decodeHtml, escapeHtml, parseHtml } from '@utils/html';

const asciiWhitespacePattern = /[ \t\n\f\r]/;

type Replacement = {
  start: number;
  end: number;
  value: string;
};

function resolveUrl(url: string, baseUrl: URL): string {
  return new URL(url, baseUrl).href;
}

function resolveSrcset(srcset: string, baseUrl: URL): string {
  const replacements: Replacement[] = [];
  let position = 0;

  while (position < srcset.length) {
    while (
      position < srcset.length &&
      (asciiWhitespacePattern.test(srcset[position]) ||
        srcset[position] === ',')
    ) {
      position += 1;
    }

    if (position >= srcset.length) {
      break;
    }

    const urlStart = position;
    while (
      position < srcset.length &&
      !asciiWhitespacePattern.test(srcset[position])
    ) {
      position += 1;
    }

    let urlEnd = position;
    while (urlEnd > urlStart && srcset[urlEnd - 1] === ',') {
      urlEnd -= 1;
    }

    const url = srcset.slice(urlStart, urlEnd);
    const resolvedUrl = resolveUrl(url, baseUrl);
    if (resolvedUrl !== url) {
      replacements.push({
        start: urlStart,
        end: urlEnd,
        value: resolvedUrl,
      });
    }

    if (urlEnd < position) {
      continue;
    }

    let inParentheses = false;
    while (position < srcset.length) {
      const character = srcset[position];
      position += 1;

      if (character === '(') {
        inParentheses = true;
      } else if (character === ')') {
        inParentheses = false;
      } else if (character === ',' && !inParentheses) {
        break;
      }
    }
  }

  let resolvedSrcset = '';
  let previousEnd = 0;
  for (const replacement of replacements) {
    resolvedSrcset += srcset.slice(previousEnd, replacement.start);
    resolvedSrcset += replacement.value;
    previousEnd = replacement.end;
  }

  return resolvedSrcset + srcset.slice(previousEnd);
}

/** Rewrite URLs in an existing trusted Astro HTML tree in place. */
export function resolveRelativeUrlsInTree(node: Node, baseUrl: URL): Node {
  walkSync(node, (node) => {
    if (node.type !== ELEMENT_NODE) return;
    for (const name of ['href', 'src', 'srcset']) {
      const original = node.attributes[name];
      if (original === undefined) continue;
      const value = decodeHtml(original);
      const resolved =
        name === 'srcset'
          ? resolveSrcset(value, baseUrl)
          : resolveUrl(value, baseUrl);
      // ultrahtml preserves raw attribute strings; escape modified values once.
      node.attributes[name] = escapeHtml(resolved);
    }
  });
  return node;
}

/** String wrapper for rendered RSS fragments. */
export default function resolveRelativeUrls(
  html: string,
  baseUrl: URL,
): string {
  return renderSync(resolveRelativeUrlsInTree(parseHtml(html), baseUrl));
}
