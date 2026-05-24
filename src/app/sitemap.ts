import type { MetadataRoute } from "next";
import { getAllDocSlugs, sources } from "@/lib/sources";

const SITE_URL = "https://hypersnap.org";

const staticRoutes = ["", "/about", "/network", "/snap", "/run-a-node", "/docs", "/contribute"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(sources.sourceUpdatedAt);

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.8,
  }));

  const docEntries: MetadataRoute.Sitemap = getAllDocSlugs().map((slug) => ({
    url: `${SITE_URL}/docs/${slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticEntries, ...docEntries];
}
