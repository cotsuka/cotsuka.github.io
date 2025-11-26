import formatDate from '@utils/formatDate.ts';
import createSlug from '@utils/createSlug.ts';
import { type CollectionEntry } from 'astro:content';

export default function (item: CollectionEntry<'articles' | 'podcasts' | 'reviews'>): string {
    switch (item.collection) {
        case 'articles':
            return `/articles/${formatDate(item.data.date)}-${item.id}/`
        case 'podcasts':
            return `/podcasts/${createSlug(item.data.show)}-${item.id}/`
        case 'reviews':
            return `/reviews/${item.data.type}/${item.id}/`
    }
}