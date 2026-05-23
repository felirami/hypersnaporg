import { getDocsTree, sources } from "@/lib/sources";

export const dynamic = "force-static";

const SITE_URL = "https://hypersnap.org";

export function GET() {
  const sections = getDocsTree();
  const lines: string[] = [];

  lines.push("# Hypersnap");
  lines.push("");
  lines.push(
    "> Hypersnap is a decentralized social network — the evolution of Farcaster, built by a global community of contributors. No company, no VC. Same wire format and identities as Farcaster, but every node is run by someone different.",
  );
  lines.push("");
  lines.push("## About this index");
  lines.push("");
  lines.push(
    "This file is the LLM-friendly index of Hypersnap's documentation. Every page below mirrors a markdown file in the open repository at github.com/farcasterorg/hypersnap-docs-web. The single concatenated source is at /llms-full.txt.",
  );
  lines.push("");
  lines.push(`Source repository: ${sources.organization.url}/hypersnap-docs-web`);
  lines.push(`Last synced: ${sources.sourceUpdatedAt}`);
  lines.push("");

  for (const section of sections) {
    lines.push(`## ${section.section}`);
    lines.push("");
    for (const link of section.links) {
      lines.push(`- [${link.title}](${SITE_URL}/docs/${link.slug}): ${link.section} reference.`);
    }
    lines.push("");
  }

  lines.push("## Project surfaces");
  lines.push("");
  lines.push(`- [About Hypersnap](${SITE_URL}/about): What it is, why it exists, who builds it.`);
  lines.push(`- [Live network status](${SITE_URL}/network): Public node, endpoints, shard data.`);
  lines.push(`- [Run a node](${SITE_URL}/run-a-node): Bootstrap, operator toolkit, doctor command, and runbook for node operators.`);
  lines.push(`- [Install helper](${SITE_URL}/install.sh): One-line installer for the open-source hypersnap operator CLI.`);
  lines.push(`- [Operator toolkit](https://github.com/arcabotai/hypersnap): Source for hypersnap doctor/share/install helper.`);
  lines.push(`- [Contribute](${SITE_URL}/contribute): How to help build it.`);
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
