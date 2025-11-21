export const siteTitle = "Cameron Otsuka";
export const siteSubtitle = "The collection of Cameron's thoughts."
export const siteAuthor = {
  "name": "Cameron Otsuka",
  "email": "cameron@otsuka.haus"
}

export const menuItems: {title: string, url: string}[] = [
    { "title": "Podcasts", "url": "/podcasts" },
    { "title": "Articles", "url": "/articles" },
    { "title": "Reviews", "url": "/reviews" }
];

export const socials: { [platform: string]: { title: string, url: string, username: string } } = {
  "x": {
    "title": "𝕏",
    "url": "https://x.com/CameronOtsuka",
    "username": "@CameronOtsuka"
  },
  "linkedin": {
    "title": "LinkedIn",
    "url": "https://www.linkedin.com/in/cotsuka",
    "username": "cotsuka"
  },
  "activitypub": {
    "title": "ActivityPub",
    "url": "https://social.otsuka.systems/@cameron",
    "username": "@cameron@otsuka.systems"
  },
  "nostr": {
    "title": "Nostr",
    "url": "https://primal.net/profile/npub1hzssq7wewjztvglpdvku92htx3sv2x5r9ycvqhvl9xrtt5fn629s3np693",
    "username": "cameron@otsuka.systems"
  }
};