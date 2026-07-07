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

fnr="${1:-}"
if [[ -n "$fnr" ]]; then
    saksnummer="$("${SCRIPT_DIR}/seed-digital-soknad.sh" "$fnr")"
else
    saksnummer="$("${SCRIPT_DIR}/seed-digital-soknad.sh")"
fi

sak_id="$("${SCRIPT_DIR}/hent-sak.sh" "$saksnummer" "sakId")"
soknad_id="$("${SCRIPT_DIR}/hent-sak.sh" "$saksnummer" "søknader[0].id")"
start_output="$("${SCRIPT_DIR}/start-soknadsbehandling.sh" "$sak_id" "$soknad_id")"
read -r behandling_id intern_deltakelse_id <<<"$start_output"
[[ -n "$behandling_id" ]] || fail "Mangler behandlingId etter start-soknadsbehandling."
[[ -n "$intern_deltakelse_id" ]] || fail "Mangler internDeltakelseId etter start-soknadsbehandling."

"${SCRIPT_DIR}/innvilg-og-iverksett.sh" "$sak_id" "$behandling_id" "$intern_deltakelse_id" >/dev/null

printf 'SAKSNUMMER=%s\n' "$saksnummer"
printf 'SAK_ID=%s\n' "$sak_id"
printf 'BEHANDLING_ID=%s\n' "$behandling_id"
