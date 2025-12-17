import { ImageResponse } from '@vercel/og';
import { type SatoriOptions } from 'satori';
import { siteAuthor } from '@utils/globals';

async function loadFont(fontName: string) {
    let url: string
    switch (fontName) {
        case 'Public Sans Variable':
            url = `https://cdn.jsdelivr.net/fontsource/fonts/public-sans@latest/latin-400-normal.ttf`;
            break;
        case 'Source Serif 4':
            url = `https://cdn.jsdelivr.net/fontsource/fonts/source-serif-4@latest/latin-400-normal.ttf`;
            break;
        case 'DejaVu Mono':
            url = `https://cdn.jsdelivr.net/fontsource/fonts/dejavu-mono@latest/latin-400-normal.ttf`;
            break;
        default:
            throw new Error('font url not defined');
    }
    
    const font = await fetch(url);
    if (font.ok) {
        return await font.arrayBuffer();
    }
    throw new Error('failed to load font data');
}

const satoriOptions: SatoriOptions = {
    width: 1200,
    height: 630,
    fonts: [
        {
            name: 'Public Sans Variable',
            data: await loadFont('Public Sans Variable'),
            style: 'normal'
        },
        {
            name: 'Source Serif 4',
            data: await loadFont('Source Serif 4'),
            style: 'normal'
        },
        {
            name: 'DejaVu Mono',
            data: await loadFont('DejaVu Mono'),
            style: 'normal'
        }
    ]
}

export default async function generateOpenGraphImage(title: string, description: string) {
    const element = {
        type: 'div',
        props: {
            style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#e6e2d6',
                color: '#000000',
                width: '100%',
                height: '100%',
                padding: 80,
                fontFamily: 'Public Sans Variable'
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
                        children: title,
                    },
                },
                {
                    type: 'p',
                    props: {
                        style: {
                            fontSize: 32,
                            marginBottom: 40,
                            fontFamily: 'Source Serif 4, DejaVu Mono'
                        },
                        children: description,
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
                                        borderTop: '2px solid #8b2942',
                                        width: 240,
                                        margin: '0 auto 8px',
                                        display: 'flex',
                                        textAlign: 'center'
                                    },
                                },
                            },
                            siteAuthor.name,
                        ],
                    },
                },
            ],
        },
        key: null
    }

    return new ImageResponse(element, satoriOptions);
}