import { z } from 'astro/zod';

/**
 * Shared subjects for articles and podcasts; reviews remain unrestricted.
 * markets: capital, credit, asset prices, and business economics.
 * systems: software, security, infrastructure, and financial rails.
 * sovereignty: state power, geopolitics, governance, and individual autonomy.
 * culture: social values, public attitudes, and workplace practices.
 * Tag the main subjects, not every passing mention or newsletter link.
 */
export const CONTENT_TAGS = [
  'markets',
  'systems',
  'sovereignty',
  'culture',
] as const;

export const contentTagsSchema = z.array(z.enum(CONTENT_TAGS)).default([]);
