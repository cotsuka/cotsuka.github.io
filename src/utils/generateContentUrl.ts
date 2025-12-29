import formatDate from '@utils/formatDate';
import { type SiteCollectionEntry } from '@utils/globals';

export default function generateContentUrl(item: SiteCollectionEntry): string {
  switch (item.collection) {
    case 'articles':
      return `/articles/${formatDate(item.data.date)}-${item.id}/`;
    case 'podcasts':
      return `/podcasts/${item.id}/`;
    case 'reviews':
      return `/reviews/${item.data.category}/${item.id}/`;
  }
}
