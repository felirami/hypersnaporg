export const dynamic = "force-static";

const INSTALLER_URL = "https://raw.githubusercontent.com/arcabotai/hypersnap/main/install.sh";

export function GET() {
  const script = `#!/usr/bin/env bash
set -euo pipefail

exec bash -c "$(curl -fsSL ${INSTALLER_URL})"
`;

  return new Response(script, {
    headers: {
      "Content-Type": "text/x-shellscript; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
