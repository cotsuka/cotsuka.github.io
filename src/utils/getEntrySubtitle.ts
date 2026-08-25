import { type SiteEntrySchema } from '@utils/globals';

function formatPublication(publication: {
  name: string;
  issue: number;
  volume: number;
}): string {
  return `${publication.name} ${publication.issue}-${publication.volume}`;
}

/**
 * Returns the subtitle shown for an entry across the site: the publication
 * citation when present, otherwise the description. Detail pages, OG images,
 * and feeds use this default; listings pass `preferDescription` to show full
 * descriptions instead of citations.
 */
export default function getEntrySubtitle(
  entryData: SiteEntrySchema,
  preferDescription = false,
): string {
  if (preferDescription && entryData.description) {
    return entryData.description;
  }

  if ('publication' in entryData && entryData.publication) {
    return formatPublication(entryData.publication);
  }

  return entryData.description ?? '';
}
