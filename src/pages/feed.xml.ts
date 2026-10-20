import rss, { type RSSFeedItem } from '@astrojs/rss';
import { siteDescription, siteTitle } from '@utils/globals';
import { type APIContext } from 'astro';
import getAllEntries from '@utils/getAllEntries';
import createContentContainer from '@utils/createContentContainer';
import EntryContent from '@components/entrycontent.astro';
import generateContentUrl from '@utils/generateContentUrl';
import getEntryPresentation from '@utils/getEntryPresentation';
import sortByDate from '@utils/sortByDate';
import resolveRelativeUrls from '@utils/resolveRelativeUrls';

export async function GET(context: APIContext) {
  const entries = sortByDate(await getAllEntries()).slice(0, 10);

  const container = await createContentContainer(context.site!);

  const feedItems: RSSFeedItem[] = [];
  for (const entry of entries) {
    const link = generateContentUrl(entry);
    const itemUrl = new URL(link, context.site);
    const renderedContent = await container.renderToString(EntryContent, {
      props: { entry },
    });
    const content = resolveRelativeUrls(renderedContent, itemUrl);
    const presentation = getEntryPresentation(entry);

    feedItems.push({
      title: presentation.feedTitle,
      link,
      pubDate: entry.data.publishedAt,
      description: presentation.feedDescription,
      content,
      categories: presentation.categories,
    });
  }

  return rss({
    title: siteTitle,
    description: siteDescription,
    site: context.site!,
    items: feedItems,
  });
}
