import { getContainerRenderer as getMDXRenderer } from '@astrojs/mdx';
import rss, { type RSSFeedItem } from '@astrojs/rss';
import { siteDescription, siteTitle } from '@utils/globals';
import { type APIContext } from 'astro';
import { getCollection, render } from 'astro:content';
import { loadRenderers } from 'astro:container';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import generateContentUrl from '@utils/generateContentUrl';
import generateStarRating from '@utils/generateStarRating';

export async function GET(context: APIContext) {
  if (!context.site) {
    throw new Error('Site URL is required for RSS feed generation');
  }

  try {
    const articles = await getCollection('articles');
    const podcasts = await getCollection('podcasts');
    const reviews = await getCollection('reviews');
    const collections = [...articles, ...podcasts, ...reviews];

    const renderers = await loadRenderers([getMDXRenderer()]);
    const container = await AstroContainer.create({ renderers });

    const feedItems: RSSFeedItem[] = [];
    for (const item of collections) {
      try {
        const link = generateContentUrl(item);
        const { Content } = await render(item);
        const content = await container.renderToString(Content);
        const categories = (item.data.tags ?? []).concat(item.collection);
        if (item.collection === 'reviews') {
          categories.push(item.data.category);
        }

        let title: string;
        let description: string;
        switch (item.collection) {
          case 'reviews': {
            const starRating = generateStarRating(item.data.rating);
            title = `${item.data.title} - ${starRating}`;
            description = starRating;
            break;
          }
          default:
            title = item.data.title;
            description = item.data.description ?? '';
            break;
        }

        feedItems.push({
          title: title,
          link: link,
          pubDate: item.data.date,
          description: description,
          content: content,
          categories: categories,
        });
      } catch (itemError) {
        // Log error but continue processing other items
        console.error(`Error processing feed item "${item.id}":`, itemError);
      }
    }

    const sortedFeedItems = feedItems.sort(
      (a, b) => (b.pubDate?.getTime() ?? 0) - (a.pubDate?.getTime() ?? 0),
    );

    return rss({
      title: siteTitle,
      description: siteDescription,
      site: context.site,
      items: sortedFeedItems.slice(0, 10),
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new Response('Error generating RSS feed', { status: 500 });
  }
}
