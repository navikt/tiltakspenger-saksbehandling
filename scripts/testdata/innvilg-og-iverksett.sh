#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./_lib.sh
source "${SCRIPT_DIR}/_lib.sh"

usage() {
    echo "Bruk: $(basename "$0") SAK_ID BEHANDLING_ID INTERN_DELTAKELSE_ID [FOM TOM]" >&2
    exit 1
}

[[ $# -eq 3 || $# -eq 5 ]] || usage

sak_id="$1"
behandling_id="$2"
intern_deltakelse_id="$3"

if [[ $# -eq 5 ]]; then
    fom="$4"
    tom="$5"
    "${SCRIPT_DIR}/oppdater-innvilgelse.sh" "$sak_id" "$behandling_id" "$intern_deltakelse_id" "$fom" "$tom" >/dev/null
else
    "${SCRIPT_DIR}/oppdater-innvilgelse.sh" "$sak_id" "$behandling_id" "$intern_deltakelse_id" >/dev/null
fi

"${SCRIPT_DIR}/send-til-beslutning.sh" "$sak_id" "$behandling_id" >/dev/null
"${SCRIPT_DIR}/ta-behandling.sh" "$sak_id" "$behandling_id" >/dev/null
"${SCRIPT_DIR}/iverksett.sh" "$sak_id" "$behandling_id" >/dev/null

printf '%s\n' "$behandling_id"
