// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import icon from 'astro-icon';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://cameron.otsuka.systems',
  fonts: [
    {
      name: 'Public Sans',
      cssVariable: '--font-sans',
      provider: fontProviders.fontsource(),
      weights: [400, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
      formats: ['woff'],
      fallbacks: ['sans-serif'],
    },
    {
      name: 'Source Serif 4',
      cssVariable: '--font-serif',
      provider: fontProviders.fontsource(),
      weights: [400, 600, 700],
      styles: ['normal', 'italic'],
      subsets: ['latin', 'latin-ext'],
      formats: ['woff'],
      fallbacks: ['serif'],
    },
    {
      name: 'Source Code Pro',
      cssVariable: '--font-mono',
      provider: fontProviders.fontsource(),
      weights: [400, 700],
      styles: ['normal'],
      subsets: ['latin'],
      formats: ['woff'],
      fallbacks: ['monospace'],
    },
    {
      name: 'DejaVu Mono',
      cssVariable: '--font-fallback',
      provider: fontProviders.fontsource(),
      weights: [400],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      formats: ['woff'],
      fallbacks: ['monospace'],
    },
  ],
  integrations: [
    icon({
      include: {
        mdi: ['rss'],
      },
    }),
    mdx(),
    sitemap(),
  ],
  markdown: {
    remarkRehype: {
      footnoteBackContent: '↩︎',
    },
    syntaxHighlight: 'prism',
  },
  image: {
    layout: 'constrained',
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        jpeg: { mozjpeg: true, progressive: true, quality: 75 },
        webp: { quality: 75, effort: 4, alphaQuality: 80 },
        avif: { quality: 50, effort: 2 },
      }
    }
  },
  vite: {
    build: {
      rollupOptions: {
        external: '/pagefind/pagefind.js',
      },
    },
  },
});
