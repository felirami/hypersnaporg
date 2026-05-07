import sourceSnapshot from "@/data/farcasterorg-sources.json";
import type { SourceDocLink, SourceSnapshot } from "@/lib/types";

export const sources = sourceSnapshot as SourceSnapshot;

export function getRepo(name: string) {
  return sources.repos.find((repo) => repo.name === name);
}

export type EnrichedDocLink = SourceDocLink & { repoName: string };

export function getDocsLinks(): EnrichedDocLink[] {
  return sources.repos.flatMap((repo) =>
    repo.docsLinks.map((link) => ({
      ...link,
      repoName: repo.name,
    })),
  );
}

export function getPrimaryRepos() {
  const order = ["hypersnap", "hypersnap-docs-web", "snap", "protocol"];
  return [...sources.repos].sort((a, b) => {
    const aRank = order.indexOf(a.name);
    const bRank = order.indexOf(b.name);
    return (aRank === -1 ? 99 : aRank) - (bRank === -1 ? 99 : bRank);
  });
}

const DOCS_REPO_NAME = "hypersnap-docs-web";

export type DocsSection = {
  section: string;
  links: EnrichedDocLink[];
};

export function getRenderedDocs(): EnrichedDocLink[] {
  return getDocsLinks().filter(
    (link) => link.repoName === DOCS_REPO_NAME && link.slug && (link.contentHtml ?? "").length > 0,
  );
}

export function getDocBySlug(slug: string): EnrichedDocLink | undefined {
  const docs = getRenderedDocs();
  return docs.find((doc) => doc.slug === slug);
}

export function getDocsTree(): DocsSection[] {
  const docs = getRenderedDocs();
  const order: string[] = [];
  const sectionMap = new Map<string, EnrichedDocLink[]>();

  for (const doc of docs) {
    if (!sectionMap.has(doc.section)) {
      sectionMap.set(doc.section, []);
      order.push(doc.section);
    }
    sectionMap.get(doc.section)!.push(doc);
  }

  return order.map((section) => ({
    section,
    links: sectionMap.get(section) ?? [],
  }));
}

export function getAllDocSlugs(): string[] {
  return getRenderedDocs()
    .map((doc) => doc.slug)
    .filter((slug): slug is string => Boolean(slug));
}
