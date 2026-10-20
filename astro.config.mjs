// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://cameron.otsuka.systems',
  experimental: {
    contentIntellisense: true,
    incrementalBuild: true,
    // Two workers reduce static rendering time without using every CPU core.
    parallelPrerender: { workers: 2 },
  },
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
      subsets: ['latin'],
      formats: ['woff'],
      fallbacks: ['monospace'],
    },
    {
      // OG-only fallback: load the complete emoji subset, not individual glyphs.
      name: 'Noto Emoji',
      cssVariable: '--font-emoji',
      provider: fontProviders.fontsource(),
      weights: [400],
      styles: ['normal'],
      subsets: ['emoji'],
      // Sharp/Pango requires a native font file to shape joined emoji.
      formats: ['ttf'],
      fallbacks: [],
    },
  ],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      transformers: [
        {
          code(node) {
            // Keep language labels when Turndown exports fenced Markdown.
            this.addClassToHast(node, `language-${this.options.lang}`);
          },
        },
      ],
    },
    processor: satteri({
      features: {
        gfm: {
          footnotes: {
            backContent: '↩︎',
          },
        },
      },
    }),
  },
  integrations: [mdx({ optimize: true }), sitemap()],
  image: {
    layout: 'constrained',
    breakpoints: [640, 960, 1280],
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        jpeg: { mozjpeg: true, progressive: true, quality: 75 },
        webp: { quality: 75, effort: 4, alphaQuality: 80 },
        avif: { quality: 50, effort: 2 },
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
