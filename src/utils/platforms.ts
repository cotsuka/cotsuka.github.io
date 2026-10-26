/** Stable storage IDs mapped to their public labels. */
export const PLATFORMS = {
  x: '𝕏',
  linkedin: 'LinkedIn',
  nostr: 'Nostr',
  youtube: 'YouTube',
  substack: 'Substack',
  spotify: 'Spotify',
  letterboxd: 'Letterboxd',
  goodreads: 'Goodreads',
} as const;

export type PlatformId = keyof typeof PLATFORMS;
export const PLATFORM_IDS = Object.keys(PLATFORMS) as PlatformId[];

export function getPlatformLabel(id: string): string {
  return PLATFORMS[id as PlatformId];
}
