import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import createSlug from '@utils/createSlug.ts';
import generateOpenGraphImage from '@utils/generateOpenGraphImage.ts';

export async function getStaticPaths() {
    const podcasts = await getCollection('podcasts');
    return podcasts.map(podcast => ({
        params: { show: createSlug(podcast.data.show), id: podcast.id },
        props: { podcast },
    }));
};

export const GET: APIRoute = async ({ props }) => {
    return generateOpenGraphImage(
        props.podcast.data.title,
        `${props.podcast.data.show} - ${props.podcast.data.description}`
    )
};