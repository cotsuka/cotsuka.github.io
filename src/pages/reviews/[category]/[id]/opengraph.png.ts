import { createOgRoutes } from '@utils/createOgRoutes';
import generateStarRating from '@utils/generateStarRating';

export const { getStaticPaths, GET } = createOgRoutes(
  'reviews',
  (review) => ({
    category: review.data.category,
    id: review.id,
  }),
  (review) => generateStarRating(review.data.rating) ?? '',
);
