import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import { toString as mdastToString } from "mdast-util-to-string";
import GithubSlugger from "github-slugger";
import { visit } from "unist-util-visit";

const ORG = "farcasterorg";
const API_BASE = "https://api.github.com";
const OUT_FILE = path.join(process.cwd(), "src/data/farcasterorg-sources.json");
const SOURCE_REPO_ORDER = ["hypersnap", "hypersnap-docs-web", "snap", "protocol"];

const DOCS_LINK_LIMIT = 80;
const README_HEADING_LIMIT = 10;

const githubToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

async function fetchGithubJson(url, { optional = false } = {}) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(githubToken ? { Authorization: `Bearer ${githubToken}` } : {}),
    },
    signal: AbortSignal.timeout(10000),
  });

  if ((response.status === 404 || response.status === 409) && optional) {
    return null;
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub request failed: ${response.status} ${url}\n${body}`);
  }

  return response.json();
}

async function fetchGithubText(url, { optional = false } = {}) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.raw",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(githubToken ? { Authorization: `Bearer ${githubToken}` } : {}),
    },
    signal: AbortSignal.timeout(10000),
  });

  if ((response.status === 404 || response.status === 409) && optional) {
    return "";
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub text request failed: ${response.status} ${url}\n${body}`);
  }

  return response.text();
}

function sortRepos(repos) {
  const rank = new Map(SOURCE_REPO_ORDER.map((name, index) => [name, index]));
  return [...repos].sort((a, b) => {
    const aRank = rank.get(a.name) ?? 100;
    const bRank = rank.get(b.name) ?? 100;
    return aRank - bRank || a.name.localeCompare(b.name);
  });
}

function stripMarkdown(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/[`*_>#-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function summarizeMarkdown(markdown, fallback = "") {
  const lines = markdown
    .split("\n")
    .filter((line) => line.trim() && !line.trim().startsWith("#") && !line.trim().startsWith("|"));

  const text = stripMarkdown(lines.slice(0, 16).join(" "));
  const summary = text || fallback || "No README summary is available yet.";

  return summary.length > 420 ? `${summary.slice(0, 417).trim()}...` : summary;
}

function extractHeadings(markdown) {
  return markdown
    .split("\n")
    .map((line) => line.match(/^(#{1,3})\s+(.+)$/)?.[2]?.trim())
    .filter(Boolean)
    .slice(0, README_HEADING_LIMIT);
}

function extractPublicNode(texts) {
  const match = texts.join("\n").match(/https:\/\/haatz\.quilibrium\.com/g);
  return match?.[0] ?? "https://haatz.quilibrium.com";
}

function extractRequirementBullets(readme) {
  const match = readme.match(/system requirements[\s\S]*?(?=\n\n)/i);
  if (!match) {
    return [
      "16 GB RAM",
      "4 CPU cores or vCPUs",
      "1.5 TB free storage",
      "Public IP address",
      "Ports 3381-3383 exposed on TCP and UDP",
    ];
  }

  return match[0]
    .split("\n")
    .map((line) => line.match(/^\s*-\s+(.+)$/)?.[1]?.trim())
    .filter(Boolean);
}

function extractHyperGoals(hyperDoc) {
  const goalsSection = hyperDoc.match(/## Goals\s+([\s\S]*?)(?=\n## )/);
  return (goalsSection?.[1] ?? "")
    .split("\n")
    .map((line) => line.match(/^\s*-\s+(.+)$/)?.[1]?.trim())
    .filter(Boolean);
}

function stripDocsRoot(sourcePath) {
  return sourcePath
    .replace(/^src\//, "")
    .replace(/^docs\//, "")
    .replace(/^site\/docs\/pages\//, "");
}

function computeDocSlug(sourcePath) {
  const stripped = stripDocsRoot(sourcePath)
    .replace(/\.(md|mdx)$/, "")
    .replace(/\/index$/, "");
  return stripped || "introduction";
}

function computeDocDir(sourcePath) {
  const stripped = stripDocsRoot(sourcePath);
  const lastSlash = stripped.lastIndexOf("/");
  return lastSlash === -1 ? "" : stripped.substring(0, lastSlash);
}

function resolveInternalSlug(currentDir, target) {
  // Drop trailing anchors during path resolution
  const [pathPart, hash] = target.split("#");
  let pathSegment = pathPart.replace(/\.(md|mdx)$/, "");

  // If absolute (starts with /), treat as already resolved
  if (pathSegment.startsWith("/")) {
    pathSegment = pathSegment.replace(/^\/+/, "");
  } else {
    // Resolve relative to the current doc's source directory
    const cleaned = pathSegment.replace(/^\.\//, "");
    pathSegment = currentDir ? `${currentDir}/${cleaned}` : cleaned;
  }

  const parts = pathSegment.split("/");
  const stack = [];
  for (const part of parts) {
    if (part === "..") stack.pop();
    else if (part && part !== ".") stack.push(part);
  }
  let resolved = stack.join("/").replace(/\/index$/, "");
  if (!resolved) resolved = currentDir;
  return hash ? `${resolved}#${hash}` : resolved;
}

function remarkRewriteInternalLinks(currentDir) {
  return (tree) => {
    visit(tree, "link", (node) => {
      const url = node.url;
      if (!url) return;
      if (
        url.startsWith("http://") ||
        url.startsWith("https://") ||
        url.startsWith("//") ||
        url.startsWith("mailto:") ||
        url.startsWith("tel:")
      ) {
        return;
      }
      if (url.startsWith("#")) return; // anchor on same page

      const resolved = resolveInternalSlug(currentDir, url);
      node.url = `/docs/${resolved}`;
    });
  };
}

function captureTocPlugin(toc) {
  return () => (tree) => {
    const slugger = new GithubSlugger();
    visit(tree, "heading", (node) => {
      if (node.depth < 2 || node.depth > 3) return;
      const text = mdastToString(node).trim();
      if (!text) return;
      const id = slugger.slug(text);
      toc.push({ depth: node.depth, text, id });
    });
  };
}

async function renderMarkdownToHtml(markdown, currentDir) {
  const toc = [];

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(() => remarkRewriteInternalLinks(currentDir))
    .use(captureTocPlugin(toc))
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: "append",
      properties: {
        className: ["heading-anchor"],
        ariaLabel: "Anchor link to this heading",
      },
      content: {
        type: "text",
        value: " #",
      },
    })
    .use(rehypeHighlight, { detect: true, ignoreMissing: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);

  return { html: String(file), toc };
}

async function enrichDocsLinks(docsLinks, repoName, branch) {
  const enriched = [];
  for (const link of docsLinks) {
    const slug = computeDocSlug(link.sourcePath);
    const dir = computeDocDir(link.sourcePath);
    const markdown = await fetchGithubText(
      `${API_BASE}/repos/${ORG}/${repoName}/contents/${link.sourcePath}?ref=${encodeURIComponent(branch)}`,
      { optional: true },
    );

    if (!markdown) {
      enriched.push({ ...link, slug, contentHtml: "", contentMarkdown: "", toc: [] });
      continue;
    }

    let contentHtml = "";
    let toc = [];
    try {
      const result = await renderMarkdownToHtml(markdown, dir);
      contentHtml = result.html;
      toc = result.toc;
    } catch (error) {
      console.error(`Failed to render ${link.sourcePath}:`, error.message);
    }

    enriched.push({
      ...link,
      slug,
      contentHtml,
      contentMarkdown: markdown,
      toc,
    });
  }
  return enriched;
}

function extractDocsLinksFromSummary(summary, repoName, branch) {
  const links = [];
  let section = "Docs";

  for (const line of summary.split("\n")) {
    const heading = line.match(/^#+\s+(.+)$/);
    if (heading) {
      section = heading[1].trim();
      continue;
    }

    const link = line.match(/-\s+\[([^\]]+)]\(([^)]+)\)/);
    if (!link) {
      continue;
    }

    const [, title, relativePath] = link;
    if (relativePath.startsWith("http")) {
      continue;
    }

    const cleanPath = relativePath.replace(/^\.\//, "src/");
    links.push({
      title,
      section,
      sourcePath: cleanPath,
      githubUrl: `https://github.com/${ORG}/${repoName}/blob/${branch}/${cleanPath}`,
    });
  }

  return links.slice(0, DOCS_LINK_LIMIT);
}

function docsLinksFromTree(tree, repoName, branch) {
  return tree
    .filter((item) => item.type === "blob")
    .map((item) => item.path)
    .filter((itemPath) => {
      const isDoc = itemPath.startsWith("docs/") || itemPath.startsWith("site/docs/pages/");
      const isMarkdown = itemPath.endsWith(".md") || itemPath.endsWith(".mdx");
      return isDoc && isMarkdown;
    })
    .sort()
    .slice(0, DOCS_LINK_LIMIT)
    .map((sourcePath) => ({
      title: sourcePath
        .split("/")
        .at(-1)
        .replace(/\.(md|mdx)$/, "")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (letter) => letter.toUpperCase()),
      section: sourcePath.startsWith("docs/") ? "Architecture" : "Protocol docs",
      sourcePath,
      githubUrl: `https://github.com/${ORG}/${repoName}/blob/${branch}/${sourcePath}`,
    }));
}

async function getRepoTree(repoName, branch) {
  if (!branch) {
    return [];
  }

  const tree = await fetchGithubJson(
    `${API_BASE}/repos/${ORG}/${repoName}/git/trees/${encodeURIComponent(branch)}?recursive=1`,
    { optional: true },
  );

  return tree?.tree ?? [];
}

async function getLatestRelease(repoName) {
  const release = await fetchGithubJson(`${API_BASE}/repos/${ORG}/${repoName}/releases/latest`, {
    optional: true,
  });

  if (!release) {
    return null;
  }

  return {
    tagName: release.tag_name,
    name: release.name || release.tag_name,
    url: release.html_url,
    publishedAt: release.published_at,
  };
}

async function buildRepoSnapshot(repo) {
  const defaultBranch = repo.default_branch || "";
  const readme = defaultBranch
    ? await fetchGithubText(`${API_BASE}/repos/${ORG}/${repo.name}/readme`, { optional: true })
    : "";
  const tree = await getRepoTree(repo.name, defaultBranch);
  const latestRelease = await getLatestRelease(repo.name);

  let docsLinks = docsLinksFromTree(tree, repo.name, defaultBranch);
  let publicNodeReferences = [];
  let architectureNotes = [];
  let nodeRequirements = [];

  if (repo.name === "hypersnap") {
    const hyperDoc = await fetchGithubText(
      `${API_BASE}/repos/${ORG}/${repo.name}/contents/docs/hyper.md?ref=${encodeURIComponent(defaultBranch)}`,
      { optional: true },
    );
    architectureNotes = extractHyperGoals(hyperDoc);
    nodeRequirements = extractRequirementBullets(readme);
  }

  if (repo.name === "hypersnap-docs-web") {
    const summary = await fetchGithubText(
      `${API_BASE}/repos/${ORG}/${repo.name}/contents/src/SUMMARY.md?ref=${encodeURIComponent(defaultBranch)}`,
      { optional: true },
    );
    const intro = await fetchGithubText(
      `${API_BASE}/repos/${ORG}/${repo.name}/contents/src/introduction.md?ref=${encodeURIComponent(defaultBranch)}`,
      { optional: true },
    );
    const gettingStarted = await fetchGithubText(
      `${API_BASE}/repos/${ORG}/${repo.name}/contents/src/getting-started.md?ref=${encodeURIComponent(defaultBranch)}`,
      { optional: true },
    );
    docsLinks = extractDocsLinksFromSummary(summary, repo.name, defaultBranch);
    docsLinks = await enrichDocsLinks(docsLinks, repo.name, defaultBranch);
    publicNodeReferences = [extractPublicNode([readme, intro, gettingStarted])];
  } else {
    docsLinks = docsLinks.map((link) => ({
      ...link,
      slug: computeDocSlug(link.sourcePath),
    }));
  }

  return {
    name: repo.name,
    description: repo.description || "",
    url: repo.html_url,
    defaultBranch,
    isEmpty: !defaultBranch || (tree.length === 0 && !readme),
    primaryLanguage: repo.language || null,
    license: repo.license?.spdx_id || null,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    openIssues: repo.open_issues_count,
    pushedAt: repo.pushed_at,
    updatedAt: repo.updated_at,
    latestRelease,
    readmeSummary: summarizeMarkdown(readme, repo.description || ""),
    readmeHeadings: extractHeadings(readme),
    docsLinks,
    sourceFacts: {
      publicNodeReferences,
      architectureNotes,
      nodeRequirements,
    },
  };
}

async function main() {
  const org = await fetchGithubJson(`${API_BASE}/orgs/${ORG}`);
  const repos = await fetchGithubJson(`${API_BASE}/orgs/${ORG}/repos?type=public&per_page=100`);
  const sortedRepos = sortRepos(repos.filter((repo) => !repo.archived));
  const repoSnapshots = [];

  for (const repo of sortedRepos) {
    repoSnapshots.push(await buildRepoSnapshot(repo));
  }

  const sourceUpdatedAt = repoSnapshots
    .map((repo) => repo.pushedAt || repo.updatedAt)
    .filter(Boolean)
    .sort()
    .at(-1);

  const hypersnapRepo = repoSnapshots.find((repo) => repo.name === "hypersnap");
  const docsRepo = repoSnapshots.find((repo) => repo.name === "hypersnap-docs-web");

  const snapshot = {
    schemaVersion: 1,
    organization: {
      login: org.login,
      name: org.name || org.login,
      url: org.html_url,
      avatarUrl: org.avatar_url,
      publicRepoCount: org.public_repos,
      createdAt: org.created_at,
    },
    sourceUpdatedAt,
    publicNode: {
      baseUrl: docsRepo?.sourceFacts.publicNodeReferences[0] || "https://haatz.quilibrium.com",
      infoEndpoint: "/v1/info",
      apiPrefix: "/v2/farcaster",
    },
    node: {
      bootstrapCommand:
        "curl -sSL https://raw.githubusercontent.com/farcasterorg/hypersnap/refs/heads/main/scripts/hypersnap-bootstrap.sh | bash",
      nightlyCommand:
        "curl -sSL https://raw.githubusercontent.com/farcasterorg/hypersnap/refs/heads/main/scripts/hypersnap-bootstrap.sh | bash -s nightly",
      commands: [
        { label: "Upgrade", command: "cd ~/hypersnap && ./hypersnap.sh upgrade" },
        { label: "Logs", command: "cd ~/hypersnap && ./hypersnap.sh logs" },
        { label: "Stop", command: "cd ~/hypersnap && ./hypersnap.sh down" },
        { label: "Local info", command: "curl http://localhost:3381/v1/info | jq ." },
      ],
      requirements:
        hypersnapRepo?.sourceFacts.nodeRequirements?.length
          ? hypersnapRepo.sourceFacts.nodeRequirements
          : extractRequirementBullets(""),
      ports: ["3381/tcp HTTP", "3382/udp gossip", "3383/tcp gRPC"],
      noRewardsNotice:
        "The network has not yet released a token. Running a node at this time will not earn tokens.",
    },
    repos: repoSnapshots,
  };

  await mkdir(path.dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, `${JSON.stringify(snapshot, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
