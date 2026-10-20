import { getContainerRenderer as getMDXRenderer } from '@astrojs/mdx/container-renderer';
import { loadRenderers } from 'astro:container';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';

/** Keep each render's state local while sharing the MDX and site setup. */
export default async function createContentContainer(site: URL) {
  const renderers = await loadRenderers([getMDXRenderer()]);
  return AstroContainer.create({
    renderers,
    astroConfig: { site: site.href },
  });
}
