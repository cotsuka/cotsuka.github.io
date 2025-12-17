import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import generateOpenGraphImage from '@utils/generateOpenGraphImage';

export async function getStaticPaths() {
    const podcasts = await getCollection('podcasts');
    return podcasts.map(podcast => ({
        params: { id: podcast.id },
        props: { podcast },
    }));
};

export const GET: APIRoute = async ({ props }) => {
    return generateOpenGraphImage(
        props.podcast.data.title,
        props.podcast.data.description
    )
};