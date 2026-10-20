import type { APIRoute } from 'astro';
import { siteTitle, siteDescription } from '@utils/globals';
import generateOpenGraphImage from '@utils/generateOpenGraphImage';

export const GET: APIRoute = ({ url }) =>
  generateOpenGraphImage(
    siteTitle,
    { text: siteDescription, kind: 'text' },
    url.origin,
  );
