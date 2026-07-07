#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./_lib.sh
source "${SCRIPT_DIR}/_lib.sh"

usage() {
    echo "Bruk: $(basename "$0") SAK_ID SOKNAD_ID" >&2
    exit 1
}

[[ $# -eq 2 ]] || usage

sak_id="$1"
soknad_id="$2"
require_server

response="$(http_saksbehandler POST "/sak/${sak_id}/soknad/${soknad_id}/behandling/ny-behandling")"
behandling_id="$(jval "$response" "id")"
intern_deltakelse_id="$(jval "$response" "saksopplysninger.tiltaksdeltagelse[0].internDeltakelseId")"
[[ -n "$behandling_id" ]] || fail "Mangler behandlingId i responsen."
[[ -n "$intern_deltakelse_id" ]] || fail "Mangler internDeltakelseId i responsen."
printf '%s %s\n' "$behandling_id" "$intern_deltakelse_id"
