import { getCollection } from 'astro:content';
import formatDate from '@utils/formatDate';
import { type SiteCollection, type SiteCollectionEntry } from '@utils/globals';

export function getContentParams(
  item: SiteCollectionEntry,
): Record<string, string> {
  switch (item.collection) {
    case 'articles':
      return { date: formatDate(item.data.date), id: item.id };
    case 'podcasts':
      return { id: item.id };
    case 'reviews':
      return { type: item.data.type, id: item.id };
  }
}

export default function generateContentUrl(item: SiteCollectionEntry): string {
  switch (item.collection) {
    case 'articles': {
      const { date, id } = getContentParams(item);
      return `/articles/${date}-${id}/`;
    }
    case 'podcasts': {
      const { id } = getContentParams(item);
      return `/podcasts/${id}/`;
    }
    case 'reviews': {
      const { type, id } = getContentParams(item);
      return `/reviews/${type}/${id}/`;
    }
  }
}

/** Builds an Astro `getStaticPaths` export for a collection's detail routes. */
export function getContentStaticPaths(collection: SiteCollection) {
  return async () => {
    const entries = await getCollection(collection);
    return entries.map((entry) => ({
      params: getContentParams(entry),
      props: { entry },
    }));
  };
}
