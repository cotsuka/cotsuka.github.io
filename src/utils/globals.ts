import type { CollectionEntry, InferEntrySchema } from 'astro:content';

export const siteTitle = 'Cameron Otsuka';
export const siteDescription =
  "Cameron Otsuka's personal site featuring Bitcoin analysis, capital market insights, and thoughtful commentary on technology, privacy, and culture.";
export const siteAuthor = {
  name: 'Cameron Otsuka',
  email: 'cameron@otsuka.haus',
};
export const SITE_COLLECTIONS = ['articles', 'podcasts', 'reviews'] as const;

export type SiteCollection = (typeof SITE_COLLECTIONS)[number];
export type SiteCollectionEntry = CollectionEntry<SiteCollection>;
export type SiteEntrySchema = InferEntrySchema<SiteCollection>;

export const menuItems: { title: string; url: string }[] = [
  { title: 'Articles', url: '/articles' },
  { title: 'Podcasts', url: '/podcasts' },
  { title: 'Reviews', url: '/reviews' },
  { title: 'Search', url: '/search' },
];

export const socials: {
  [platform: string]: { title: string; url: string; username: string };
} = {
  x: {
    title: '𝕏',
    url: 'https://x.com/CameronOtsuka',
    username: '@CameronOtsuka',
  },
  linkedin: {
    title: 'LinkedIn',
    url: 'https://www.linkedin.com/in/cotsuka',
    username: 'cotsuka',
  },
  activitypub: {
    title: 'ActivityPub',
    url: 'https://social.otsuka.systems/@cameron',
    username: '@cameron@otsuka.systems',
  },
  nostr: {
    title: 'Nostr',
    url: 'https://primal.net/profile/npub1hzssq7wewjztvglpdvku92htx3sv2x5r9ycvqhvl9xrtt5fn629s3np693',
    username: 'cameron@otsuka.systems',
  },
};
