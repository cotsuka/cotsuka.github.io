import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { formatDate } from '@utils/format.ts';
import { siteSubtitle, siteTitle } from '@utils/globals.ts';

export async function GET(context: any) {
  const articles = await getCollection('articles');
  const articleItems = articles.map((article) => ({
    title: article.data.title,
    pubDate: article.data.date,
    description: article.data.description,
    link: `/articles/${formatDate(article.data.date)}-${article.id}/`
  }));

  const roundups = await getCollection('roundups');
  const roundupItems = roundups.map((roundup) => ({
    title: roundup.data.title,
    pubDate: roundup.data.date,
    description: roundup.data.description,
    link: `/build-weekly-roundup/${roundup.id}/`
  }));

  const reviews = await getCollection('reviews');
  const reviewItems = reviews.map((review) => ({
    title: review.data.title,
    pubDate: review.data.date,
    description: review.data.description,
    link: `/reviews/${review.data.type}/${review.id}/`
  }));

  const feedItems = [ ...articleItems, ...roundupItems, ...reviewItems ];
  const sortedFeedItems = feedItems.sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
  return rss({
    title: siteTitle,
    description: siteSubtitle,
    site: context.site,
    items: sortedFeedItems
  });
}