import { type SiteCollectionEntry } from '@utils/globals';

export default function sortByDate<T extends SiteCollectionEntry>(
  items: T[],
): T[] {
  return [...items].sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}
