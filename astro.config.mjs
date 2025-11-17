// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';


export default defineConfig({
  site: 'https://cameron.otsuka.systems',
  integrations: [mdx(), react(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'monokai'
    },
  },
});