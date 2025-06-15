// @ts-check
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import Metadata from 'data/metadata.json';

export default defineConfig({
  site: 'https://otsuka.haus',
  trailingSlash: 'always',
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});