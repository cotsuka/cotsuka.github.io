import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import generateOpenGraphImage from '@utils/generateOpenGraphImage.ts';

export async function getStaticPaths() {
    const reviews = await getCollection('reviews');
    return reviews.map(review => ({
        params: { type: review.data.type, id: review.id },
        props: { review },
    }));
};

export const GET: APIRoute = async ({ props }) => {
    return generateOpenGraphImage(
        props.review.data.title,
        props.review.data.description ?? ""
    )
};