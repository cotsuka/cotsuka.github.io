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

const links = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: 'content/links' }),
    schema: z.object({
        title: z.string(),
        href: z.string().url(),
        description: z.string(),
        date: z.coerce.date(),
        modified: z.coerce.date().optional(),
        tags: z.array(z.string()).optional(),
        posse: z.record(z.string(), z.string().url()).optional()
    })
});

const reviews = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: 'content/reviews' }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.coerce.date(),
        modified: z.coerce.date().optional(),
        tags: z.array(z.string()).optional(),
        posse: z.record(z.string(), z.string().url()).optional()
    })
});

export const collections = { articles, links, reviews };