import type { APIRoute } from "astro";
import { renderLlmsIndex } from "@/lib/llms";

export const GET: APIRoute = () =>
  new Response(renderLlmsIndex(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
