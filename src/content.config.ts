import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const baseSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.coerce.date(),
  modified: z.coerce.date().optional(),
  tags: z.array(z.string()).optional(),
  posse: z.record(z.string(), z.string().url()).optional(),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'content/articles' }),
  schema: baseSchema,
});

const podcasts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'content/podcasts' }),
  schema: baseSchema.extend({
    type: z.enum(['audio', 'video']),
    enclosure: z
      .object({
        url: z.string().url(),
        length: z.number(),
        type: z.string(),
      })
      .optional(),
  }),
});

const reviews = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'content/reviews' }),
  schema: baseSchema.extend({
    rating: z.number().gt(0).lte(5).step(1),
    category: z.enum(['book', 'game', 'movie', 'music', 'show']),
  }),
});

export const collections = { articles, podcasts, reviews };
