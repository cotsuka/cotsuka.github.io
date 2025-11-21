import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: 'content/articles' }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.coerce.date(),
        modified: z.coerce.date().optional(),
        tags: z.array(z.string()).optional(),
        posse: z.record(z.string(), z.string().url()).optional()
    })
});

const PodcastType = z.enum([
    "audio",
    "video"
])

const podcasts = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: 'content/podcasts' }),
    schema: z.object({
        type: PodcastType,
        title: z.string(),
        href: z.string().url(),
        description: z.string(),
        date: z.coerce.date(),
        modified: z.coerce.date().optional(),
        tags: z.array(z.string()).optional(),
        posse: z.record(z.string(), z.string().url()).optional()
    })
});

const ReviewType = z.enum([
    "game",
    "movie",
    "music",
    "show"
])

const reviews = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: 'content/reviews' }),
    schema: z.object({
        type: ReviewType,
        title: z.string(),
        description: z.string().optional(),
        rating: z.number().gt(0).lte(5).step(1),
        date: z.coerce.date(),
        modified: z.coerce.date().optional(),
        tags: z.array(z.string()).optional(),
        posse: z.record(z.string(), z.string().url()).optional()
    })
});

export const collections = { articles, podcasts, reviews };