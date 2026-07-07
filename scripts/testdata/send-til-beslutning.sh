#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./_lib.sh
source "${SCRIPT_DIR}/_lib.sh"

usage() {
    echo "Bruk: $(basename "$0") SAK_ID BEHANDLING_ID" >&2
    exit 1
}

[[ $# -eq 2 ]] || usage

sak_id="$1"
behandling_id="$2"
require_server

http_saksbehandler POST "/sak/${sak_id}/behandling/${behandling_id}/sendtilbeslutning" >/dev/null
printf '%s\n' "$behandling_id"
