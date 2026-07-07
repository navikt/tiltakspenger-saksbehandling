#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./_lib.sh
source "${SCRIPT_DIR}/_lib.sh"

usage() {
    echo "Bruk: $(basename "$0") [FNR]" >&2
    exit 1
}

[[ $# -le 1 ]] || usage

fnr="${1:-}"
require_server

if [[ -n "$fnr" ]]; then
    body="$(python3 - "$fnr" <<'PY'
import json
import sys

print(json.dumps({"barnetillegg": [], "fnr": sys.argv[1]}, ensure_ascii=False))
PY
)"
else
    body='{"barnetillegg":[]}'
fi

saksnummer="$(http_noauth POST "/dev/soknad/ny" "$body")"
[[ -n "$saksnummer" ]] || fail "Mottok tomt saksnummer fra /dev/soknad/ny."
printf '%s\n' "$saksnummer"
