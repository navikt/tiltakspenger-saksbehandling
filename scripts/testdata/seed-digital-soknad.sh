#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./_lib.sh
source "${SCRIPT_DIR}/_lib.sh"

usage() {
    echo "Bruk: $(basename "$0") [FNR [FOM TOM]]" >&2
    exit 1
}

[[ $# -eq 0 || $# -eq 1 || $# -eq 3 ]] || usage

fnr="${1:-}"
fom="${2:-}"
tom="${3:-}"
require_server

body="$(python3 - "$fnr" "$fom" "$tom" <<'PY'
import json
import sys

fnr, fom, tom = sys.argv[1], sys.argv[2], sys.argv[3]
body = {"barnetillegg": []}
if fnr:
    body["fnr"] = fnr
if fom and tom:
    body["deltakelsesperiode"] = {"fraOgMed": fom, "tilOgMed": tom}
print(json.dumps(body, ensure_ascii=False))
PY
)"

saksnummer="$(http_noauth POST "/dev/soknad/ny" "$body")"
[[ -n "$saksnummer" ]] || fail "Mottok tomt saksnummer fra /dev/soknad/ny."
printf '%s\n' "$saksnummer"
