import { getDocsTree, sources } from "@/lib/sources";

export const dynamic = "force-static";

const SITE_URL = "https://hypersnap.org";

export function GET() {
  const sections = getDocsTree();
  const parts: string[] = [];

  parts.push("# Hypersnap — Full documentation");
  parts.push("");
  parts.push(
    "Hypersnap is a decentralized social network built by a global community of contributors. No company, no VC. The evolution of Farcaster: same wire format and identities, but every node is run by someone different.",
  );
  parts.push("");
  parts.push(`Source repository: ${sources.organization.url}/hypersnap-docs-web`);
  parts.push(`Last synced: ${sources.sourceUpdatedAt}`);
  parts.push(`Site index: ${SITE_URL}/llms.txt`);
  parts.push("");
  parts.push("---");
  parts.push("");

  for (const section of sections) {
    parts.push(`# ${section.section}`);
    parts.push("");

    for (const link of section.links) {
      const markdown = link.contentMarkdown?.trim() ?? "";
      parts.push(`---`);
      parts.push("");
      parts.push(`<!-- ${link.title} -->`);
      parts.push(`<!-- Source: ${link.githubUrl} -->`);
      parts.push(`<!-- Site URL: ${SITE_URL}/docs/${link.slug} -->`);
      parts.push("");
      parts.push(markdown);
      parts.push("");
    }
  }

  return new Response(parts.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
