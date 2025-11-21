import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { formatDate } from '@utils/format.ts';
import { siteSubtitle, siteTitle } from '@utils/globals.ts';

export async function GET(context: any) {
  const articles = await getCollection('articles');
  const articleItems = articles.map((article) => ({
    title: article.data.title,
    link: `/articles/${formatDate(article.data.date)}-${article.id}/`,
    pubDate: article.data.date,
    description: article.data.description,
    categories: (article.data.tags ?? []).concat('articles')
  }));

  const roundups = await getCollection('roundups');
  const roundupItems = roundups.map((roundup) => ({
    title: roundup.data.title,
    link: `/build-weekly-roundup/${roundup.id}/`,
    pubDate: roundup.data.date,
    description: roundup.data.description,
    categories: (roundup.data.tags ?? []).concat('roundups')
  }));

  const reviews = await getCollection('reviews');
  const reviewItems = reviews.map((review) => ({
    title: review.data.title,
    link: `/reviews/${review.data.type}/${review.id}/`,
    pubDate: review.data.date,
    description: review.data.description,
    categories: (review.data.tags ?? []).concat(review.data.type).concat('reviews')
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