#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./_lib.sh
source "${SCRIPT_DIR}/_lib.sh"

usage() {
    echo "Bruk: $(basename "$0") SAK_ID KJEDE_ID [SAKSNUMMER]" >&2
    exit 1
}

[[ $# -ge 2 && $# -le 3 ]] || usage

sak_id="$1"
kjede_id="$2"
saksnummer="${3:-}"
require_server

raw_response="$(
    curl -sS \
        -X POST \
        "${BASE_URL}/sak/${sak_id}/meldekort/opprettBehandling" \
        -H "Authorization: Bearer ${TOKEN_SAKSBEHANDLER}" \
        -H "Content-Type: application/json" \
        --data "{\"kjedeIder\":[\"${kjede_id}\"]}" \
        -w '__HTTP_STATUS__:%{http_code}'
)"
http_status="${raw_response##*__HTTP_STATUS__:}"
response="${raw_response%__HTTP_STATUS__:*}"

meldekortbehandling_id=""
if [[ "$http_status" =~ ^2[0-9][0-9]$ && -n "$response" ]]; then
    meldekortbehandling_id="$(jval "$response" "id" 2>/dev/null || true)"
fi
if [[ ! "$http_status" =~ ^2[0-9][0-9]$ ]]; then
    kode="$(jval "$response" "kode" 2>/dev/null || true)"
    if [[ "$http_status" != "400" || "$kode" != "kjede_er_under_behandling" ]]; then
        fail "Kunne ikke opprette meldekortbehandling (HTTP ${http_status}): ${response}"
    fi
fi
if [[ -z "$meldekortbehandling_id" ]]; then
    if [[ -z "$saksnummer" ]]; then
        lookup_body="$(python3 - "$sak_id" <<'PY'
import json
import sys

print(json.dumps({"fnr": sys.argv[1]}, ensure_ascii=False))
PY
)"
        lookup_response="$(http_saksbehandler POST "/sak" "$lookup_body")"
        saksnummer="$(jval "$lookup_response" "saksnummer")"
    fi
    sak_json="$(http_saksbehandler GET "/sak/${saksnummer}")"
    meldekortbehandling_id="$(python3 -c '
import json, sys
print(next(k["åpenBehandlingId"] or "" for k in json.loads(sys.argv[1])["meldeperiodeKjeder"] if k["id"] == sys.argv[2]))
' "$sak_json" "$kjede_id")"
fi

[[ -n "$meldekortbehandling_id" ]] || fail "Mangler meldekortbehandlingId etter opprettelse."
printf '%s\n' "$meldekortbehandling_id"
