#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./_lib.sh
source "${SCRIPT_DIR}/_lib.sh"

usage() {
    echo "Bruk: $(basename "$0") FNR [V2|V3]" >&2
    echo "Oppdragsversjonen gjelder bare når saken opprettes, og avvises i prod." >&2
    exit 1
}

[[ $# -eq 1 || $# -eq 2 ]] || usage

fnr="$1"
oppdragsversjon="${2:-}"
[[ -z "$oppdragsversjon" || "$oppdragsversjon" == "V2" || "$oppdragsversjon" == "V3" ]] || usage
require_server

body="$(python3 - "$fnr" "$oppdragsversjon" <<'PY'
import json
import sys

body = {"fnr": sys.argv[1]}
if sys.argv[2]:
    body["oppdragsversjon"] = sys.argv[2]
print(json.dumps(body, ensure_ascii=False))
PY
)"

response="$(http_saksbehandler PUT "/sak" "$body")"
saksnummer="$(jval "$response" "saksnummer")"
[[ -n "$saksnummer" ]] || fail "Mangler saksnummer i responsen fra PUT /sak."
printf '%s\n' "$saksnummer"
