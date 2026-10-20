import { getCollection } from 'astro:content';
import { SITE_COLLECTIONS } from '@utils/collections';

/** Query fresh collection data for each build or development request. */
export default async function getAllEntries() {
  return (
    await Promise.all(SITE_COLLECTIONS.map((name) => getCollection(name)))
  ).flat();
}
