import type { APIRoute } from "astro";
import { renderInstallScript } from "@/lib/llms";

export const GET: APIRoute = () =>
  new Response(renderInstallScript(), {
    headers: {
      "Content-Type": "text/x-shellscript; charset=utf-8",
    },
  });
