// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import icon from 'astro-icon';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://cameron.otsuka.systems',
  cacheDir: './.astro-cache',
  fonts: [
    {
      name: 'Public Sans',
      cssVariable: '--font-sans',
      provider: fontProviders.fontsource(),
      weights: ['400 700'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
    {
      name: 'Source Serif 4',
      cssVariable: '--font-serif',
      provider: fontProviders.fontsource(),
      weights: ['400 700'],
      styles: ['normal', 'italic'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['serif'],
    },
    {
      name: 'Source Code Pro',
      cssVariable: '--font-mono',
      provider: fontProviders.fontsource(),
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
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
    syntaxHighlight: {
      type: 'prism',
      excludeLangs: ['math', 'console'],
    },
  },
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "connect-src 'self' https://ph.otsuka.systems",
        "frame-src https://www.youtube-nocookie.com",
        "object-src 'none'",
        "base-uri 'self'",
      ],
      scriptDirective: {
        resources: ["'self'", 'https://ph.otsuka.systems'],
        strictDynamic: true,
      },
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
