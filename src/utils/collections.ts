/** Shared collection labels and paths. Detail-route rules stay explicit. */
export const COLLECTIONS = {
  articles: {
    label: 'Articles',
    basePath: '/articles',
    description:
      "Cameron Otsuka's articles exploring Bitcoin, technology, monetary systems, and technical insights.",
  },
  podcasts: {
    label: 'Podcasts',
    basePath: '/podcasts',
    description:
      'Weekly podcast episodes covering capital markets, Bitcoin, economic policy, and geopolitical events. Join Cameron Otsuka in his podcast appearances.',
  },
  reviews: {
    label: 'Reviews',
    basePath: '/reviews',
    description:
      "Cameron Otsuka's personal media reviews and ratings. Explore thoughtful critiques of media, ranging from classics to recent releases, with star ratings from 1 to 5.",
  },
} as const;

export type SiteCollection = keyof typeof COLLECTIONS;
export const SITE_COLLECTIONS = Object.keys(COLLECTIONS) as SiteCollection[];
