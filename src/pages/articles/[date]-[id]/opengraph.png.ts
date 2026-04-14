import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import formatDate from '@utils/formatDate';
import generateOpenGraphImage from '@utils/generateOpenGraphImage';

export const GET = (async ({ props, url }) => {
  const entry = props.entry;
  return generateOpenGraphImage(
    entry.data.title,
    entry.data.description,
    url.origin,
  );
}) satisfies APIRoute;

export async function getStaticPaths() {
  const articles = await getCollection('articles');
  return articles.map((article) => ({
    params: { date: formatDate(article.data.date), id: article.id },
    props: { entry: article },
  }));
}
