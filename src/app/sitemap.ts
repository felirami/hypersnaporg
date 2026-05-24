import type { MetadataRoute } from "next";

const routes = ["", "/about", "/network", "/snap", "/run-a-node", "/docs", "/contribute"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `https://hypersnap.org${route}`,
    lastModified: new Date("2026-05-12"),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
