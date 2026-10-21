import { getCollection } from 'astro:content';
import type { SiteCollection } from '@utils/globals';
import { getContentParams } from '@utils/generateContentUrl';
import getEntryCacheKey from '@utils/getEntryCacheKey';

/** Build an Astro `getStaticPaths` export for a collection's detail routes. */
export default function getContentStaticPaths(
  collection: SiteCollection,
  imageOnly = false,
) {
  return async () => {
    const entries = await getCollection(collection);
    return Promise.all(
      entries.map(async (entry) => ({
        params: getContentParams(entry),
        props: { entry },
        // OG images use only metadata; HTML also reads prose and related entries.
        cacheKey: imageOnly
          ? JSON.stringify(entry.data)
          : await getEntryCacheKey(entry),
      })),
    );
  };
}
