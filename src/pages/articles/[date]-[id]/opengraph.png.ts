import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { formatDate } from '@utils/format.ts';
import { ImageResponse } from '@vercel/og';
import SiteMetadata from '@data/metadata.json';

export async function getStaticPaths() {
    const articles = await getCollection('articles');
    return articles.map(article => ({
        params: { date: formatDate(article.data.date), id: article.id },
        props: { article },
    }));
};

async function loadFont() {
    const url = `https://cdn.jsdelivr.net/fontsource/fonts/public-sans@latest/latin-400-normal.ttf`
    const font = await fetch(url);
    if (font) {
        return await font.arrayBuffer();
    }
    throw new Error('failed to load font data');
};

export const GET: APIRoute = async ({ props }) => {
    const element = {
        type: 'div',
        props: {
            style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#555555',
                color: '#ffffff',
                width: '100%',
                height: '100%',
                padding: 80,
                fontFamily: 'Public Sans Variable',
            },
            children: [
                {
                    type: 'h1',
                    props: {
                        style: {
                            fontSize: 64,
                            fontWeight: 600,
                            marginBottom: 20,
                        },
                        children: props.article.data.title,
                    },
                },
                {
                    type: 'p',
                    props: {
                        style: {
                            fontSize: 32,
                            marginBottom: 40,
                        },
                        children: props.article.data.description,
                    },
                },
                {
                    type: 'div',
                    props: {
                        style: {
                            marginTop: 'auto',
                            textTransform: 'uppercase',
                            fontSize: 20,
                            fontWeight: 500,
                            letterSpacing: '0.1em',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        },
                        children: [
                            {
                                type: 'div',
                                props: {
                                    style: {
                                        borderTop: '2px solid #ffffff',
                                        width: 240,
                                        margin: '0 auto 8px',
                                        display: 'flex',
                                        textAlign: 'center'
                                    },
                                },
                            },
                            SiteMetadata.author.name,
                        ],
                    },
                },
            ],
        },
    }
    return new ImageResponse(element, {
        width: 1200,
        height: 630,
        fonts: [
            {
                name: 'Public Sans Variable',
                data: await loadFont(),
                style: 'normal'
            }
        ]
    });
};