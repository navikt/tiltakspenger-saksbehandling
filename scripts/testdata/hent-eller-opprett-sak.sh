#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./_lib.sh
source "${SCRIPT_DIR}/_lib.sh"

usage() {
    echo "Bruk: $(basename "$0") FNR" >&2
    exit 1
}

[[ $# -eq 1 ]] || usage

fnr="$1"
require_server

body="$(python3 - "$fnr" <<'PY'
import json
import sys

print(json.dumps({"fnr": sys.argv[1]}, ensure_ascii=False))
PY
)"

response="$(http_saksbehandler PUT "/sak" "$body")"
saksnummer="$(jval "$response" "saksnummer")"
[[ -n "$saksnummer" ]] || fail "Mangler saksnummer i responsen fra PUT /sak."
printf '%s\n' "$saksnummer"
