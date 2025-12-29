import { createOgRoutes } from '@utils/createOgRoutes';

export const { getStaticPaths, GET } = createOgRoutes(
  'podcasts',
  (podcast) => ({
    id: podcast.id,
  }),
);
