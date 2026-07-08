#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./_lib.sh
source "${SCRIPT_DIR}/_lib.sh"

usage() {
    echo "Bruk: $(basename "$0") SAK_ID KLAGEBEHANDLING_ID" >&2
    echo "  Vurderer klagebehandlingen til OPPRETTHOLD (krever at klagen har et påklaget vedtak" >&2
    echo "  og oppfylte formkrav, dvs. opprettet med opprett-klage.sh SAK_ID VEDTAK_ID)." >&2
    exit 1
}

[[ $# -eq 2 ]] || usage

sak_id="$1"
klagebehandling_id="$2"
require_server

body='{"vurderingstype":"OPPRETTHOLD","begrunnelse":null,"årsak":null,"hjemler":["ARBEIDSMARKEDSLOVEN_17"]}'

response="$(http_saksbehandler PATCH "/sak/${sak_id}/klage/${klagebehandling_id}/vurder" "$body")"
status="$(jval "$response" "status" 2>/dev/null || true)"
log "Klagebehandling ${klagebehandling_id} vurdert til OPPRETTHOLD (status: ${status:-ukjent})."
printf '%s\n' "$klagebehandling_id"
