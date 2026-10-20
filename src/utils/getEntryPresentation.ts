import type { SiteCollectionEntry } from '@utils/globals';
import formatDate from '@utils/formatDate';
import generateStarRating from '@utils/generateStarRating';

export type EntrySubtitle = { text: string; kind: 'text' | 'rating' };

export function formatPublication(publication: {
  name: string;
  issue: number;
  volume: number;
}): string {
  return `${publication.name} ${publication.issue}-${publication.volume}`;
}

/** Derive display values without mixing or duplicating source fields. */
export default function getEntryPresentation(entry: SiteCollectionEntry) {
  const { data } = entry;
  const publication = 'publication' in data ? data.publication : undefined;
  const publicationName = publication?.name ?? '';
  const publicationLabel = publication ? formatPublication(publication) : '';
  const description = data.description ?? '';
  const subtitle = publicationLabel || description;
  const ratingText =
    entry.collection === 'reviews' ? generateStarRating(entry.data.rating) : '';
  const videoUrl =
    entry.collection === 'podcasts' ? entry.data.videoUrl : undefined;
  const posse = { ...data.posse, ...(videoUrl ? { youtube: videoUrl } : {}) };
  const ogSubtitle: EntrySubtitle = {
    text: ratingText || subtitle,
    kind: ratingText ? 'rating' : 'text',
  };

  return {
    // Entries without prose summaries use their citation for metadata.
    metaDescription: description || publicationLabel,
    listSubtitle: description || publicationLabel,
    publicationName,
    publicationLabel,
    categories: [
      ...data.tags,
      entry.collection,
      data.format,
      ...(publicationName ? [publicationName] : []),
    ],
    ratingText,
    ogSubtitle,
    feedTitle: ratingText ? `${data.title} - ${ratingText}` : data.title,
    feedDescription: ratingText || subtitle,
    posse,
    publishedAt: data.publishedAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
    publishedDate: formatDate(data.publishedAt),
    updatedDate: formatDate(data.updatedAt),
  };
}
