import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import normalizeEntryDates from '@utils/normalizeEntryDates';
import { contentTagsSchema } from './schemas/contentTags';
import { posseSchema } from './schemas/posse';

const baseSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  posse: posseSchema.optional(),
});

const publication = z.object({
  name: z.enum(['Build Weekly Roundup', 'Mine Print Hash', 'Inference Draft']),
  issue: z.coerce.number(),
  volume: z.coerce.number(),
});

const editorialSchema = baseSchema.extend({
  tags: contentTagsSchema,
  publication: publication.optional(),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'content/articles' }),
  schema: editorialSchema
    .extend({
      format: z.enum(['essay', 'newsletter', 'note']),
      relatedPodcast: reference('podcasts').optional(),
    })
    .transform(normalizeEntryDates),
});

const podcasts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'content/podcasts' }),
  schema: editorialSchema
    .extend({
      format: z.enum(['audio', 'video']),
      videoUrl: z.url().optional(),
    })
    .transform(normalizeEntryDates),
});

const reviews = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'content/reviews' }),
  schema: baseSchema
    .extend({
      rating: z.int().min(1).max(5),
      format: z.enum(['book', 'game', 'movie', 'music', 'show']),
    })
    .transform(normalizeEntryDates),
});

export const collections = { articles, podcasts, reviews };
