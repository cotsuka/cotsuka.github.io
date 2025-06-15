import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const socials = defineCollection({
    loader: file('data/socials.json'),
    schema: z.object({
        title: z.string(),
        url: z.string(),
        username: z.string()
    })
});

const articles = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: 'content/articles' }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.coerce.date(),
        modified: z.coerce.date().optional(),
        tags: z.array(z.string()).optional(),
        posse: z.record(z.string(), z.string()).optional()
    })
});

const links = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: 'content/links' }),
    schema: z.object({
        title: z.string(),
        href: z.string(),
        description: z.string(),
        date: z.coerce.date(),
        modified: z.coerce.date().optional(),
        tags: z.array(z.string()).optional(),
        posse: z.record(z.string(), z.string()).optional()
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
        posse: z.record(z.string(), z.string()).optional()
    })
});

export const collections = { socials, articles, links, reviews };