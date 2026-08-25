import type { APIRoute } from 'astro';
import generateOpenGraphImage from '@utils/generateOpenGraphImage';
import { getContentStaticPaths } from '@utils/generateContentUrl';
import generateStarRating from '@utils/generateStarRating';

export const getStaticPaths = getContentStaticPaths('reviews');

export const GET = (({ props, url }) =>
  generateOpenGraphImage(
    props.entry.data.title,
    generateStarRating(props.entry.data.rating),
    url.origin,
  )) satisfies APIRoute;
