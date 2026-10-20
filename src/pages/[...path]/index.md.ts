import type { APIRoute } from 'astro';
import getAllEntries from '@utils/getAllEntries';
import { build } from 'astro:config/server';
import createContentContainer from '@utils/createContentContainer';
import Home from '../index.astro';
import Bitcoin from '../bitcoin.astro';
import Articles from '../articles/index.astro';
import Podcasts from '../podcasts/index.astro';
import Reviews from '../reviews/index.astro';
import EntryArticle from '@components/entryarticle.astro';
import type { SiteCollectionEntry } from '@utils/globals';
import generateContentUrl from '@utils/generateContentUrl';
import pageMarkdown from '@utils/pageMarkdown';

const pages = {
  '/': Home,
  '/bitcoin/': Bitcoin,
  '/articles/': Articles,
  '/podcasts/': Podcasts,
  '/reviews/': Reviews,
};

type MarkdownProps = { pagePath: string; entry?: SiteCollectionEntry };

export async function getStaticPaths() {
  const entries = await getAllEntries();
  const paths: MarkdownProps[] = [
    ...Object.keys(pages).map((pagePath) => ({ pagePath })),
    ...entries.map((entry) => ({ pagePath: generateContentUrl(entry), entry })),
  ];
  return paths.map((props) => ({
    params: { path: props.pagePath.replace(/^\/|\/$/g, '') || undefined },
    props,
  }));
}

// A real Astro endpoint: rendered on demand in dev and emitted as a file in builds.
export const GET: APIRoute<MarkdownProps> = async ({ props, site }) => {
  const { pagePath, entry } = props;
  const component = entry
    ? EntryArticle
    : pages[pagePath as keyof typeof pages];
  const container = await createContentContainer(site!);
  const htmlPath =
    build.format === 'file'
      ? pagePath === '/'
        ? '/index.html'
        : `${pagePath.replace(/\/$/, '')}.html`
      : pagePath;
  const html = await container.renderToString(component, {
    request: new Request(new URL(htmlPath, site)),
    props: entry ? { entry } : {},
  });
  return new Response(pageMarkdown(html), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
