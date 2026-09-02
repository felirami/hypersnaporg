import { creator } from "./creator";

export const SITE_URL = "https://hypersnap.org";

export const defaultDescription =
  "Hypersnap is a decentralized social network portal made by Felirami, a solo developer contributing to the new Farcaster.";

export const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Hypersnap",
  url: SITE_URL,
  author: {
    "@type": "Person",
    name: creator.name,
    url: creator.website,
    sameAs: creator.links.map((link) => link.href),
  },
  creator: {
    "@type": "Person",
    name: creator.name,
    url: creator.website,
    sameAs: creator.links.map((link) => link.href),
  },
  description:
    "Hypersnap.org is made by Felirami, a solo developer contributing to the new Farcaster.",
};

export function pageTitle(title?: string) {
  return title ? `${title} | Hypersnap` : "Hypersnap";
}

export function canonicalUrl(pathname: string) {
  const path = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
  return new URL(path, SITE_URL).toString();
}
