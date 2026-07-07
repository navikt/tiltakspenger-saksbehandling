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
require_server

fnr="${1:-12345678911}"
saksnummer="$("${SCRIPT_DIR}/hent-eller-opprett-sak.sh" "$fnr")"
sak_id="$("${SCRIPT_DIR}/hent-sak.sh" "$saksnummer" "sakId")"
registrer_output="$("${SCRIPT_DIR}/registrer-papir-soknad.sh" "$saksnummer")"
read -r behandling_id intern_deltakelse_id <<<"$registrer_output"
[[ -n "$behandling_id" ]] || fail "Mangler behandlingId etter registrer-papir-soknad."
[[ -n "$intern_deltakelse_id" ]] || fail "Mangler internDeltakelseId etter registrer-papir-soknad."

"${SCRIPT_DIR}/innvilg-og-iverksett.sh" "$sak_id" "$behandling_id" "$intern_deltakelse_id" >/dev/null

printf 'SAKSNUMMER=%s\n' "$saksnummer"
printf 'SAK_ID=%s\n' "$sak_id"
printf 'BEHANDLING_ID=%s\n' "$behandling_id"
