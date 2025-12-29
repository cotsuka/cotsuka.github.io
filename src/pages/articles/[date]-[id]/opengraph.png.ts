import { createOgRoutes } from '@utils/createOgRoutes';
import formatDate from '@utils/formatDate';

export const { getStaticPaths, GET } = createOgRoutes(
  'articles',
  (article) => ({
    date: formatDate(article.data.date),
    id: article.id,
  }),
);
