import sourceSnapshot from "@/data/farcasterorg-sources.json";
import type { SourceSnapshot } from "@/lib/types";

export const sources = sourceSnapshot as SourceSnapshot;

export function getRepo(name: string) {
  return sources.repos.find((repo) => repo.name === name);
}

export function getDocsLinks() {
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
