import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("targets Cloudflare Workers through OpenNext", () => {
  const pkg = JSON.parse(read("package.json"));
  const config = read("wrangler.jsonc");

  assert.equal(pkg.dependencies["@opennextjs/cloudflare"], "1.20.5");
  assert.equal(pkg.dependencies.next, "16.3.4");
  assert.match(pkg.scripts["build:cf"], /opennextjs-cloudflare build/);
  assert.match(config, /"main": "\.open-next\/worker\.js"/);
  assert.match(config, /"nodejs_compat"/);
  assert.match(config, /"global_fetch_strictly_public"/);
  assert.match(config, /"allow_custom_ports"/);
  assert.match(config, /"workers_dev": false/);
  assert.match(config, /"preview_urls": false/);
  assert.match(config, /"binding": "NEXT_INC_CACHE_R2_BUCKET"/);
  assert.match(config, /"bucket_name": "hypersnap-next-cache"/);
  assert.match(read("open-next.config.ts"), /incrementalCache:\s*r2IncrementalCache/);
});

test("preserves runtime routes and static caching contracts", () => {
  assert.match(read("src/app/api/network-status/route.ts"), /export async function GET/);
  assert.match(read("src/app/api/snap-market/route.ts"), /export async function GET/);
  assert.match(read("src/app/install.sh/route.ts"), /text\/x-shellscript/);
  assert.match(read("public/_headers"), /max-age=31536000,immutable/);
});