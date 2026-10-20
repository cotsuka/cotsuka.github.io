import { unescape } from 'html-escaper';
import { ELEMENT_NODE, TEXT_NODE, parse, walkSync, type Node } from 'ultrahtml';

export { escape as escapeHtml } from 'html-escaper';

/** Decode Astro/XML escapes once. This is not a general named-entity decoder. */
export function decodeHtml(value: string): string {
  return value.replace(
    /&(?:amp|lt|gt|quot|apos|#(?:[xX][\da-fA-F]+|\d+));/g,
    (entity) => {
      if (!entity.startsWith('&#')) return unescape(entity);
      const hex = entity[2].toLowerCase() === 'x';
      const point = Number.parseInt(
        entity.slice(hex ? 3 : 2, -1),
        hex ? 16 : 10,
      );
      return point > 0 &&
        point <= 0x10ffff &&
        !(point >= 0xd800 && point <= 0xdfff)
        ? String.fromCodePoint(point)
        : '\uFFFD';
    },
  );
}

/** Parse trusted, Astro-generated HTML with quoted, escaped attributes. */
export function parseHtml(value: string): Node {
  return parse(value) as Node;
}

export function walkHtml(node: Node): Node[] {
  const nodes: Node[] = [];
  walkSync(node, (child) => {
    nodes.push(child);
  });
  return nodes;
}

export function htmlAttribute(node: Node, name: string): string | undefined {
  const value = node.type === ELEMENT_NODE ? node.attributes[name] : undefined;
  return value === undefined ? undefined : decodeHtml(value);
}

export function htmlText(node: Node): string {
  return walkHtml(node)
    .map((child) => (child.type === TEXT_NODE ? decodeHtml(child.value) : ''))
    .join('');
}
