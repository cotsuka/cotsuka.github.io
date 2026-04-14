import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import generateOpenGraphImage from '@utils/generateOpenGraphImage';
import generateStarRating from '@utils/generateStarRating';

export const GET = (async ({ props, url }) => {
  const entry = props.entry;
  return generateOpenGraphImage(
    entry.data.title,
    generateStarRating(entry.data.rating),
    url.origin,
  );
}) satisfies APIRoute;

export async function getStaticPaths() {
  const reviews = await getCollection('reviews');
  return reviews.map((review) => ({
    params: { category: review.data.category, id: review.id },
    props: { entry: review },
  }));
}
