#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./_lib.sh
source "${SCRIPT_DIR}/_lib.sh"

usage() {
    echo "Bruk: $(basename "$0") SAK_ID [VEDTAK_ID]" >&2
    echo "  Uten VEDTAK_ID: klage uten påklaget vedtak (gir avvisning / avvisningsbrev)." >&2
    echo "  Med VEDTAK_ID: klage på vedtaket med oppfylte formkrav (kan opprettholdes / innstillingsbrev)." >&2
    exit 1
}

[[ $# -ge 1 && $# -le 2 ]] || usage

sak_id="$1"
vedtak_id="${2:-}"
require_server

if [[ -n "$vedtak_id" ]]; then
    vedtak_json="\"${vedtak_id}\""
else
    vedtak_json="null"
fi

body="$(cat <<JSON
{
  "journalpostId":"12345",
  "vedtakDetKlagesPå":${vedtak_json},
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
