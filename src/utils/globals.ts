import type { CollectionEntry } from 'astro:content';
import {
  COLLECTIONS,
  SITE_COLLECTIONS,
  type SiteCollection,
} from '@utils/collections';
import type { PlatformId } from '@utils/platforms';

export { SITE_COLLECTIONS } from '@utils/collections';
export type { SiteCollection } from '@utils/collections';

export const siteTitle = 'Cameron Otsuka';
export const siteDescription =
  "Cameron Otsuka's personal site featuring Bitcoin analysis, capital market insights, and thoughtful commentary on technology, privacy, and culture.";
export const siteAuthor = {
  name: 'Cameron Otsuka',
  email: 'cameron@otsuka.haus',
};
export type SiteCollectionEntry = CollectionEntry<SiteCollection>;

export const menuItems = [
  ...SITE_COLLECTIONS.map((name) => ({
    title: COLLECTIONS[name].label,
    url: COLLECTIONS[name].basePath,
  })),
  { title: 'Search', url: '/search' },
];

export const socials = {
  x: {
    url: 'https://x.com/CameronOtsuka',
    username: '@CameronOtsuka',
  },
  linkedin: {
    url: 'https://www.linkedin.com/in/cotsuka',
    username: 'cotsuka',
  },
  activitypub: {
    url: 'https://social.otsuka.systems/@cameron',
    username: '@cameron@otsuka.systems',
  },
  nostr: {
    url: 'https://primal.net/profile/npub1hzssq7wewjztvglpdvku92htx3sv2x5r9ycvqhvl9xrtt5fn629s3np693',
    username: 'cameron@otsuka.systems',
  },
} satisfies Partial<Record<PlatformId, { url: string; username: string }>>;
