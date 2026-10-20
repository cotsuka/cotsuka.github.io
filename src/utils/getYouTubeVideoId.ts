/** Extract a validated ID from authored watch, share, shorts, or embed URLs. */
export default function getYouTubeVideoId(videoUrl: string): string {
  const url = new URL(videoUrl);
  const host = url.hostname.replace(/^(www\.|m\.)/, '');
  const parts = url.pathname.split('/').filter(Boolean);
  const videoId =
    host === 'youtu.be' && parts.length === 1
      ? parts[0]
      : ['youtube.com', 'youtube-nocookie.com'].includes(host)
        ? url.pathname === '/watch'
          ? url.searchParams.get('v')
          : ['shorts', 'embed', 'live'].includes(parts[0]) && parts.length === 2
            ? parts[1]
            : null
        : null;

  if (
    !['https:', 'http:'].includes(url.protocol) ||
    !videoId ||
    !/^[\w-]{11}$/.test(videoId)
  ) {
    throw new TypeError(`Invalid YouTube video URL: ${videoUrl}`);
  }
  return videoId;
}
