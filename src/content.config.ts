import { defineCollection, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const baseSchema = (image: SchemaContext['image']) =>
  z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    modified: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    posse: z.record(z.string(), z.url()).optional(),
    image: image().optional(),
  });

const publication = z.object({
  name: z.enum(['Build Weekly Roundup', 'Mine Print Hash', 'Inference Draft']),
  issue: z.coerce.number().positive(),
  volume: z.coerce.number().positive(),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'content/articles' }),
  schema: ({ image }) =>
    baseSchema(image).extend({
      type: z.enum(['essay', 'newsletter', 'note']),
      publication: publication.optional(),
    }),
});

const podcasts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'content/podcasts' }),
  schema: ({ image }) =>
    baseSchema(image).extend({
      type: z.enum(['audio', 'video']),
      publication: publication.optional(),
      enclosure: z
        .object({
          url: z.url(),
          length: z.coerce.number().int().nonnegative(),
          type: z.string(),
        })
        .optional(),
    }),
});

const reviews = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'content/reviews' }),
  schema: ({ image }) =>
    baseSchema(image).extend({
      rating: z.int().gt(0).lte(5),
      type: z.enum(['book', 'game', 'movie', 'music', 'show']),
    }),
});

export const collections = { articles, podcasts, reviews };
