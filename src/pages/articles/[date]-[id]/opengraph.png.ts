import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import formatDate from '@utils/formatDate';
import generateOpenGraphImage from '@utils/generateOpenGraphImage';

export async function getStaticPaths() {
    const articles = await getCollection('articles');
    return articles.map(article => ({
        params: { date: formatDate(article.data.date), id: article.id },
        props: { article },
    }));
};

export const GET: APIRoute = async ({ props }) => {
    return generateOpenGraphImage(
        props.article.data.title,
        props.article.data.description
    )
};