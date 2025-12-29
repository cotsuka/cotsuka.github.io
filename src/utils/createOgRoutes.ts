import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import generateOpenGraphImage from '@utils/generateOpenGraphImage';

type SiteCollection = 'articles' | 'podcasts' | 'reviews';

export function createOgRoutes<T extends SiteCollection>(
  collectionName: T,
  getParams: (entry: CollectionEntry<T>) => Record<string, string>,
  getDescription?: (entry: CollectionEntry<T>) => string,
) {
  const getStaticPaths: GetStaticPaths = async () => {
    const entries = await getCollection(collectionName);
    return entries.map((entry) => ({
      params: getParams(entry),
      props: { entry },
    }));
  };

  const GET: APIRoute = async ({ props }) => {
    if (!props.entry) {
      throw new Error('Missing entry prop in OG route');
    }
    const entry = props.entry as CollectionEntry<T>;
    const description = getDescription
      ? getDescription(entry)
      : ((entry.data as { description?: string }).description ?? '');
    return generateOpenGraphImage(entry.data.title, description);
  };

  return { getStaticPaths, GET };
}
