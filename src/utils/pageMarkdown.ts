import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import { ELEMENT_NODE, renderSync } from 'ultrahtml';
import { htmlAttribute, htmlText, parseHtml, walkHtml } from './html';
import { resolveRelativeUrlsInTree } from './resolveRelativeUrls';

/** Convert the rendered main content, including MDX components, not raw JSX. */
export default function pageMarkdown(html: string): string {
  const nodes = walkHtml(parseHtml(html));
  const main = nodes.find(
    (node) => node.type === ELEMENT_NODE && node.name === 'main',
  );
  const canonical = nodes.find(
    (node) => htmlAttribute(node, 'rel') === 'canonical',
  );
  const pageURL = new URL(htmlAttribute(canonical!, 'href')!);
  const meta = (name: string) => {
    const node = nodes.find(
      (node) =>
        htmlAttribute(node, 'property') === name ||
        htmlAttribute(node, 'name') === name,
    );
    return node && htmlAttribute(node, 'content');
  };
  const titleNode = nodes.find(
    (node) => node.type === ELEMENT_NODE && node.name === 'title',
  );
  const title = meta('og:title') ?? htmlText(titleNode!);
  const converter = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
  });
  const iframeLink = (node: HTMLElement): string => {
    const source = node.getAttribute('src');
    return source
      ? `\n\n[${converter.escape(node.getAttribute('title') || 'Embedded media')}](${source})\n\n`
      : '';
  };
  converter.use(gfm);
  converter.addRule('single-line-table-cells', {
    filter: ['th', 'td'],
    replacement: (content, node) => {
      const prefix = node.previousSibling ? ' ' : '| ';
      const inline = content
        .trim()
        .replace(/\s*\n\s*/g, ' ')
        // Escape bare pipes, but preserve pipes already escaped by a rule.
        .replace(/(?<!\\)((?:\\\\)*)\|/g, '$1\\|');
      return `${prefix}${inline} |`;
    },
  });
  converter.remove(['script', 'style', 'nav', 'footer']);
  converter.addRule('content-blocks', {
    filter: ['dl', 'dt', 'dd', 'details', 'summary'],
    replacement: (content) => `\n\n${content.trim()}\n\n`,
  });
  converter.addRule('page-title', {
    filter: (node) =>
      /^H[12]$/.test(node.nodeName) && node.textContent?.trim() === title,
    replacement: () => '',
  });
  converter.addRule('linked-headings', {
    filter: (node) =>
      node.nodeName === 'A' && Boolean(node.querySelector('h1,h2,h3,h4,h5,h6')),
    replacement: (_content, node) =>
      `\n\n[${converter.escape(node.textContent?.trim() || '')}](${node.getAttribute('href')})\n\n`,
  });
  converter.addRule('list-badges', {
    filter: (node) => node.classList.contains('badges'),
    replacement: (_content, node) => {
      const badges = Array.from(node.querySelectorAll('.badge')).map((badge) =>
        converter.escape(badge.textContent?.trim() || ''),
      );
      return badges.length ? `\n\n${badges.join(', ')}\n\n` : '';
    },
  });
  converter.addRule('footnote-backlinks', {
    filter: (node) => node.hasAttribute('data-footnote-backref'),
    replacement: () => '',
  });
  converter.addRule('embedded-media', {
    filter: ['iframe'],
    replacement: (_content, node) => iframeLink(node),
  });
  // Empty iframes use Turndown's blank rule before custom rules are checked.
  converter.options.blankReplacement = (_content, node) => {
    if (node.nodeName === 'IFRAME') return iframeLink(node);
    return 'isBlock' in node && node.isBlock ? '\n\n' : '';
  };
  const body = converter.turndown(
    renderSync(resolveRelativeUrlsInTree(main!, pageURL)),
  );
  const metadata = {
    title,
    description: meta('description'),
    url: pageURL.href,
    published: meta('article:published_time'),
    updated: meta('article:modified_time'),
  };
  const frontmatter = Object.entries(metadata)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join('\n');
  return `---\n${frontmatter}\n---\n\n# ${converter.escape(title)}\n\n${body}\n`;
}
