import type { SiteCollectionEntry } from '@utils/globals';
import { siteTitle, siteDescription } from '@utils/globals';
import generateContentUrl from '@utils/generateContentUrl';
import getEntryPresentation from '@utils/getEntryPresentation';

export const SOCIAL_IMAGE = {
  width: 1200,
  height: 630,
  contentType: 'image/png',
  filename: 'opengraph.png',
} as const;

export interface SocialImage {
  path: string;
  alt: string;
}

/** Only entry pages have their own image; all other pages use the site image. */
export function getSocialImage(
  entry?: SiteCollectionEntry,
  presentation = entry ? getEntryPresentation(entry) : undefined,
): SocialImage {
  if (!entry) {
    return {
      path: `/${SOCIAL_IMAGE.filename}`,
      alt: `${siteTitle} — ${siteDescription}`,
    };
  }
  const subtitle = presentation!.ogSubtitle.text;
  return {
    path: `${generateContentUrl(entry)}${SOCIAL_IMAGE.filename}`,
    alt: subtitle ? `${entry.data.title} — ${subtitle}` : entry.data.title,
  };
}
