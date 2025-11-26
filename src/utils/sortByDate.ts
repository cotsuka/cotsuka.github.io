import { type CollectionEntry } from 'astro:content';

export default function (items: CollectionEntry<'articles' | 'podcasts' | 'reviews'>[]): CollectionEntry<'articles' | 'podcasts' | 'reviews'>[] {
    return items.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}