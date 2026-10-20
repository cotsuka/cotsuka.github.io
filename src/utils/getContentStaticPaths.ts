import { getCollection } from 'astro:content';
import type { SiteCollection } from '@utils/globals';
import { getContentParams } from '@utils/generateContentUrl';

/** Build an Astro `getStaticPaths` export for a collection's detail routes. */
export default function getContentStaticPaths(
  collection: SiteCollection,
  cacheOutput = false,
) {
  return async () => {
    const entries = await getCollection(collection);
    return entries.map((entry) => ({
      params: getContentParams(entry),
      props: { entry },
      // Only OG routes opt in: their output depends on data, not body/related entries.
      // Astro separately invalidates changes to imported code and configuration.
      cacheKey: cacheOutput ? JSON.stringify(entry.data) : undefined,
    }));
  };
}
