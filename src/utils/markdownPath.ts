/** Markdown endpoint URLs work in dev and are prerendered for static hosting. */
export default function markdownPath(pathname: string): string | undefined {
  const path =
    pathname === '/index.html'
      ? '/'
      : pathname.replace(/\/+$/, '').replace(/\.html$/, '') || '/';
  if (['/404', '/search'].includes(path)) return undefined;
  return `${path === '/' ? '' : path}/index.md`;
}
