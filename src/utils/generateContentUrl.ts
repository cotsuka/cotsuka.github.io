import formatDate from '@utils/formatDate';
import type { SiteCollectionEntry } from '@utils/globals';
import { COLLECTIONS } from '@utils/collections';

export function getContentParams(
  item: SiteCollectionEntry,
): Record<string, string> {
  switch (item.collection) {
    case 'articles':
      return { date: formatDate(item.data.publishedAt), id: item.id };
    case 'podcasts':
      return { id: item.id };
    case 'reviews':
      return { format: item.data.format, id: item.id };
  }
}

export default function generateContentUrl(item: SiteCollectionEntry): string {
  const { basePath } = COLLECTIONS[item.collection];
  switch (item.collection) {
    case 'articles': {
      const { date, id } = getContentParams(item);
      return `${basePath}/${date}-${id}/`;
    }
    case 'podcasts': {
      const { id } = getContentParams(item);
      return `${basePath}/${id}/`;
    }
    case 'reviews': {
      const { format, id } = getContentParams(item);
      return `${basePath}/${format}/${id}/`;
    }
  }
}
