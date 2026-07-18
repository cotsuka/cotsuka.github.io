import { parseFragment, serialize, type DefaultTreeAdapterMap } from 'parse5';

type HtmlNode = DefaultTreeAdapterMap['node'];

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

function resolveNodeUrls(node: HtmlNode, baseUrl: URL): void {
  if ('attrs' in node) {
    for (const attribute of node.attrs) {
      if (attribute.name === 'srcset') {
        attribute.value = resolveSrcset(attribute.value, baseUrl);
      } else if (attribute.name === 'href' || attribute.name === 'src') {
        attribute.value = resolveUrl(attribute.value, baseUrl);
      }
    }
  }

  if ('content' in node) {
    resolveNodeUrls(node.content, baseUrl);
  }

  if ('childNodes' in node) {
    for (const child of node.childNodes) {
      resolveNodeUrls(child, baseUrl);
    }
  }
}

export default function resolveRelativeUrls(
  html: string,
  baseUrl: URL,
): string {
  const fragment = parseFragment(html);
  resolveNodeUrls(fragment, baseUrl);
  return serialize(fragment);
}
