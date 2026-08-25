import type { APIRoute } from 'astro';
import generateOpenGraphImage from '@utils/generateOpenGraphImage';
import { getContentStaticPaths } from '@utils/generateContentUrl';
import getEntrySubtitle from '@utils/getEntrySubtitle';

export const getStaticPaths = getContentStaticPaths('podcasts');

export const GET = (({ props, url }) =>
  generateOpenGraphImage(
    props.entry.data.title,
    getEntrySubtitle(props.entry.data),
    url.origin,
  )) satisfies APIRoute;
