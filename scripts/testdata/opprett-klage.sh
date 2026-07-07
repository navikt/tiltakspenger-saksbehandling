#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./_lib.sh
source "${SCRIPT_DIR}/_lib.sh"

usage() {
    echo "Bruk: $(basename "$0") SAK_ID" >&2
    exit 1
}

[[ $# -eq 1 ]] || usage

sak_id="$1"
require_server

body="$(cat <<'JSON'
{
  "journalpostId":"12345",
  "vedtakDetKlagesPå":null,
  "erKlagerPartISaken":true,
  "klagesDetPåKonkreteElementerIVedtaket":true,
  "erKlagefristenOverholdt":true,
  "erUnntakForKlagefrist":null,
  "erKlagenSignert":true,
  "innsendingsdato":"2025-04-15",
  "innsendingskilde":"DIGITAL"
}
JSON
)"

response="$(http_saksbehandler POST "/sak/${sak_id}/klage" "$body")"
klagebehandling_id="$(jval "$response" "id")"
[[ -n "$klagebehandling_id" ]] || fail "Mangler klagebehandlingId i responsen."
printf '%s\n' "$klagebehandling_id"
