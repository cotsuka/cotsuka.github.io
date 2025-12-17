import { type SiteCollectionEntry } from '@utils/globals';

export default function sortByDate(items: SiteCollectionEntry[]): SiteCollectionEntry[] {
    return items.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}