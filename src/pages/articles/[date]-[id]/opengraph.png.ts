import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { formatDate } from '@utils/format.ts';
import { ImageResponse } from '@vercel/og';

export async function getStaticPaths() {
    const articles = await getCollection('articles');
    return articles.map(article => ({
        params: { date: formatDate(article.data.date), id: article.id },
        props: { article },
    }));
};

export const GET: APIRoute = ({ props }) => {
    const element = {
        type: 'div',
        props: {
            style: {
                fontSize: 40,
                color: 'black',
                background: 'white',
                width: '100%',
                height: '100%',
                padding: '50px 200px',
                textAlign: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex'
            },
            children: [
                {
                    type: 'div',
                    props: {
                        children: props.article.data.title
                    }
                },
                {
                    type: 'div',
                    props: {
                        children: props.article.data.description
                    }
                }
            ]
        }
    };
  return new ImageResponse(element, { width: 1200, height: 630 });
};