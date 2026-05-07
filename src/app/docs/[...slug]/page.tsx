import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, ExternalLink, GitBranch, ListOrdered } from "lucide-react";
import { formatDate } from "@/lib/format";
import { getAllDocSlugs, getDocBySlug, getRenderedDocs, sources } from "@/lib/sources";

type Params = { slug: string[] };

export function generateStaticParams() {
  return getAllDocSlugs().map((slug) => ({ slug: slug.split("/") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const slugString = slug.join("/");
  const doc = getDocBySlug(slugString);

  if (!doc) {
    return { title: "Not found" };
  }

  return {
    title: doc.title,
    description: `${doc.section} · ${doc.title} · Hypersnap docs, mirrored from ${doc.repoName}.`,
    alternates: {
      canonical: `/docs/${slugString}`,
    },
  };
}

function findAdjacent(slugString: string) {
  const docs = getRenderedDocs();
  const index = docs.findIndex((doc) => doc.slug === slugString);
  if (index === -1) return { prev: undefined, next: undefined };
  return {
    prev: index > 0 ? docs[index - 1] : undefined,
    next: index < docs.length - 1 ? docs[index + 1] : undefined,
  };
}

export default async function DocPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const slugString = slug.join("/");
  const doc = getDocBySlug(slugString);

  if (!doc) {
    notFound();
  }

  const { prev, next } = findAdjacent(slugString);
  const tocItems = doc.toc ?? [];
  const lastSync = formatDate(sources.sourceUpdatedAt);

  return (
    <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_14rem]">
      <article className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100">
          {doc.section}
        </p>
        <h1 className="mt-3 text-balance text-4xl font-semibold tracking-normal text-white sm:text-5xl">
          {doc.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <GitBranch aria-hidden="true" className="h-4 w-4 text-cyan-200" />
            <span>
              Source: <code className="font-mono text-slate-300">{doc.repoName}/{doc.sourcePath}</code>
            </span>
          </span>
          <span>Last synced: {lastSync}</span>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <a
            className="inline-flex h-9 items-center gap-2 rounded-md border border-white/12 bg-white/[0.04] px-3 text-xs font-semibold text-white transition hover:border-cyan-300/50 hover:bg-cyan-300/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
            href={doc.githubUrl}
            rel="noreferrer"
            target="_blank"
          >
            View source on GitHub
            <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
          </a>
        </div>

        <hr className="my-10 border-white/8" />

        {doc.contentHtml ? (
          <div
            className="docs-prose"
            dangerouslySetInnerHTML={{ __html: doc.contentHtml }}
          />
        ) : (
          <div className="rounded-lg border border-amber-300/20 bg-amber-300/5 p-6 text-sm leading-6 text-amber-50">
            This page hasn&apos;t been synced yet. Try{" "}
            <code className="font-mono text-amber-100">npm run sync:sources</code>, or{" "}
            <a className="underline" href={doc.githubUrl} rel="noreferrer" target="_blank">
              view the source on GitHub
            </a>
            .
          </div>
        )}

        <hr className="mt-12 mb-8 border-white/8" />

        <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
          <p className="text-slate-400">
            Mirrored from{" "}
            <a
              className="text-cyan-200 underline underline-offset-4 hover:text-white"
              href={doc.githubUrl}
              rel="noreferrer"
              target="_blank"
            >
              {doc.repoName}
            </a>
            . Edit the source to update this page.
          </p>
          <a
            className="inline-flex items-center gap-1.5 text-cyan-200 underline-offset-4 hover:underline"
            href={doc.githubUrl}
            rel="noreferrer"
            target="_blank"
          >
            Edit on GitHub
            <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
          </a>
        </div>

        <nav
          aria-label="Doc pagination"
          className="mt-10 grid gap-3 sm:grid-cols-2"
        >
          {prev ? (
            <Link
              className="group rounded-lg border border-white/10 bg-white/[0.04] p-4 transition hover:border-cyan-300/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
              href={`/docs/${prev.slug}`}
            >
              <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.12em] text-slate-400 group-hover:text-cyan-200">
                <ChevronLeft aria-hidden="true" className="h-3.5 w-3.5" /> Previous
              </span>
              <span className="mt-2 block text-sm font-medium text-white">{prev.title}</span>
            </Link>
          ) : (
            <span aria-hidden="true" />
          )}
          {next ? (
            <Link
              className="group rounded-lg border border-white/10 bg-white/[0.04] p-4 text-right transition hover:border-cyan-300/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
              href={`/docs/${next.slug}`}
            >
              <span className="flex items-center justify-end gap-1.5 text-xs font-medium uppercase tracking-[0.12em] text-slate-400 group-hover:text-cyan-200">
                Next <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
              </span>
              <span className="mt-2 block text-sm font-medium text-white">{next.title}</span>
            </Link>
          ) : (
            <span aria-hidden="true" />
          )}
        </nav>
      </article>

      {tocItems.length > 0 ? (
        <aside aria-label="On this page" className="hidden xl:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-200">
              <ListOrdered aria-hidden="true" className="h-3.5 w-3.5" />
              On this page
            </p>
            <ul className="mt-3 space-y-1.5 border-l border-white/10 text-sm">
              {tocItems.map((item) => (
                <li
                  key={item.id}
                  className={item.depth === 3 ? "pl-4" : ""}
                >
                  <a
                    className="-ml-px block border-l border-transparent py-1 pl-4 text-slate-300 transition hover:border-white/30 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
                    href={`#${item.id}`}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      ) : null}
    </div>
  );
}
