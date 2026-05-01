import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import generateOpenGraphImage from '@utils/generateOpenGraphImage';

export const GET = (async ({ props, url }) => {
  const entry = props.entry;
  const subtitle = entry.data.publication
    ? `${entry.data.publication.name} ${entry.data.publication.issue}-${entry.data.publication.volume}`
    : entry.data.description;
  return generateOpenGraphImage(entry.data.title, subtitle, url.origin);
}) satisfies APIRoute;

export async function getStaticPaths() {
  const podcasts = await getCollection('podcasts');
  return podcasts.map((podcast) => ({
    params: { id: podcast.id },
    props: { entry: podcast },
  }));
}
