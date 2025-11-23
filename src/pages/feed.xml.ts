import { getContainerRenderer as getMDXRenderer } from '@astrojs/mdx';
import rss, { type RSSFeedItem } from '@astrojs/rss';
import formatDate from '@utils/formatDate.ts';
import { siteDescription, siteTitle } from '@utils/globals.ts';
import createSlug from '@utils/createSlug.ts';
import { getCollection, render } from 'astro:content';
import { loadRenderers } from 'astro:container';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';

export async function GET(context: any) {
  const articles = await getCollection('articles');
  const podcasts = await getCollection('podcasts');
  const reviews = await getCollection('reviews');
  const collections = [...articles, ...podcasts, ...reviews]

  const renderers = await loadRenderers([getMDXRenderer()]);
  const container = await AstroContainer.create({ renderers });

  const feedItems: RSSFeedItem[] = []
  for (const item of collections) {
    let link: string
    switch  (item.collection) {
      case 'articles':
        link = `/articles/${formatDate(item.data.date)}-${item.id}/`
        break;
      case 'podcasts':
        link = `/podcasts/${createSlug(item.data.show)}-${item.id}/`
        break;
      case 'reviews':
        link = `/reviews/${item.data.type}/${item.id}/`
        break;
    }

    const { Content } = await render(item);
    const content = await container.renderToString(Content);
    const categories = (item.data.tags ?? []).concat(item.collection)
    if ('type' in item.data) {
      categories.concat(item.data.type)
    }
    if ('show' in item.data) {
      categories.concat(item.data.show)
    }

    feedItems.push({
      title: item.data.title,
      link: link,
      pubDate: item.data.date,
      description: item.data.description,
      content: content,
      categories: categories
    })
  }
  const sortedFeedItems = feedItems.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: siteTitle,
    description: siteDescription,
    site: context.site,
    items: sortedFeedItems.slice(0, 10)
  });
}