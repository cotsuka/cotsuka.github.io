import type { APIRoute } from 'astro';
import type { SiteCollectionEntry } from '@utils/globals';
import generateOpenGraphImage from '@utils/generateOpenGraphImage';
import getEntryPresentation from '@utils/getEntryPresentation';

export const GET: APIRoute<{ entry: SiteCollectionEntry }> = ({ props, url }) =>
  generateOpenGraphImage(
    props.entry.data.title,
    getEntryPresentation(props.entry).ogSubtitle,
    url.origin,
  );
