import { getEntry } from 'astro:content';
import type { SiteCollectionEntry } from '@utils/globals';

/** Include data that rendering can read outside the entry's module graph. */
export default async function getEntryCacheKey(entry: SiteCollectionEntry) {
  const reference =
    'relatedPodcast' in entry.data ? entry.data.relatedPodcast : undefined;
  const podcast = reference ? await getEntry(reference) : undefined;

  return JSON.stringify({
    data: entry.data,
    digest: entry.digest,
    relatedPodcast: podcast?.data,
    year: new Date().getFullYear(),
  });
}
