// @ts-check
import { defineConfig } from 'astro/config';

import icon from 'astro-icon';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://cameron.otsuka.systems',
  integrations: [
    icon({
      include: {
        mdi: ['rss'],
      },
    }),
    mdx(),
    react(),
    sitemap(),
  ],
  markdown: {
    remarkRehype: {
      footnoteBackContent: '↩︎',
    },
    shikiConfig: {
      theme: 'monokai',
    },
  },
  vite: {
    build: {
      rollupOptions: {
        external: '/pagefind/pagefind.js',
      },
    },
  },
});
