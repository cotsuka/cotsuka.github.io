export default function (text: string): string {
    return (
        text
            .trim()
            .replace(/[^A-Za-z0-9 ]/g, '')
            .replace(/\s+/g, '-')
            .replace(/^-+|-+$/g, '')
            .toLowerCase()
    )
}