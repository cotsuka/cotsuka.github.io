import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import generateOpenGraphImage from '@utils/generateOpenGraphImage';
import generateStarRating from '@utils/generateStarRating';

export async function getStaticPaths() {
    const reviews = await getCollection('reviews');
    return reviews.map(review => ({
        params: { category: review.data.category, id: review.id },
        props: { review },
    }));
};

export const GET: APIRoute = async ({ props }) => {
    return generateOpenGraphImage(
        props.review.data.title,
        generateStarRating(props.review.data.rating) ?? ""
    )
};