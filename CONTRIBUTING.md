# Contributing to Hypersnap.org

Hypersnap.org is the public website for Hypersnap — a decentralized fork of Snapchain for Farcaster data, public APIs, node operators, and open protocol contributors.

## Development setup

Requirements: Node.js 22 and npm.

```bash
git clone https://github.com/farcasterorg/hypersnaporg.git
cd hypersnaporg
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript without emitting files |
| `npm run sync:sources` | Refresh the curated Farcasterorg source snapshot |

## Source sync

The site reads from `src/data/farcasterorg-sources.json`, a curated snapshot of public facts from `farcasterorg` repositories: repo metadata, README summaries, release data, docs links, public node details, node commands, and architecture notes.

To refresh it locally:

```bash
npm run sync:sources
```

The script lives at `scripts/sync-sources.mjs` and may call the GitHub API. Set `GITHUB_TOKEN` if you hit rate limits.

### Automated sync

The workflow in `.github/workflows/sync-farcasterorg-sources.yml` runs daily (and on manual dispatch). It:

1. Runs `npm run sync:sources`
2. Validates the site with lint, typecheck, and build
3. Opens a pull request when the snapshot changes

Review those PRs before merging — they keep the portal aligned with upstream repos without pushing directly to `main`.

## CI

Pull requests and pushes to `main` run `.github/workflows/ci.yml`:

- `npm ci`
- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Making changes

1. Fork the repo and create a branch from `main`.
2. Make your changes and run lint, typecheck, and build locally.
3. Open a pull request with a clear summary of what changed and why.

For protocol, docs, or API work, see the repositories listed on the [Contribute](/contribute) page at `github.com/farcasterorg`.
