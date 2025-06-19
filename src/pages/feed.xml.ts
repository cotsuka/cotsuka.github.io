import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { formatDate } from '@utils/format.ts';
import SiteMetadata from '@data/metadata.json';

export async function GET(context: any) {
  const articles = await getCollection('articles');
  const articleItems = articles.map((article) => ({
    title: article.data.title,
    pubDate: article.data.date,
    description: article.data.description,
    link: `/articles/${formatDate(article.data.date)}-${article.id}/`
  }));
  const links = await getCollection('links');
  const linkItems = links.map((link) => ({
    title: link.data.title,
    pubDate: link.data.date,
    description: link.data.description,
    link: `/links/${formatDate(link.data.date)}-${link.id}/`
  }));
  const reviews = await getCollection('reviews');
  const reviewItems = reviews.map((review) => ({
    title: review.data.title,
    pubDate: review.data.date,
    description: review.data.description,
    link: `/reviews/${formatDate(review.data.date)}-${review.id}/`
  }));
  const feedItems = [ ...articleItems, ...linkItems, ...reviewItems ];
  const sortedFeedItems = feedItems.sort((a, b) => b.pubDate - a.pubDate);
  return rss({
    title: SiteMetadata.title,
    description: SiteMetadata.subtitle,
    site: context.site,
    items: sortedFeedItems
  });
}