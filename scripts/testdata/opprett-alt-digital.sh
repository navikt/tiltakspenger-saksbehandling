#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./_lib.sh
source "${SCRIPT_DIR}/_lib.sh"

usage() {
    echo "Bruk: $(basename "$0")" >&2
    exit 1
}

[[ $# -eq 0 ]] || usage
require_server

output="$("${SCRIPT_DIR}/opprett-innvilget-sak-digital.sh")"
saksnummer=""
sak_id=""
behandling_id=""
while IFS='=' read -r key value; do
    case "$key" in
    SAKSNUMMER) saksnummer="$value" ;;
    SAK_ID) sak_id="$value" ;;
    BEHANDLING_ID) behandling_id="$value" ;;
    esac
done <<<"$output"

[[ -n "$saksnummer" ]] || fail "Mangler saksnummer fra opprett-innvilget-sak-digital.sh."
[[ -n "$sak_id" ]] || fail "Mangler sakId fra opprett-innvilget-sak-digital.sh."
[[ -n "$behandling_id" ]] || fail "Mangler behandlingId fra opprett-innvilget-sak-digital.sh."

kjede_id="$("${SCRIPT_DIR}/hent-sak.sh" "$saksnummer" "meldeperiodeKjeder[0].id")"
meldekortbehandling_id="$("${SCRIPT_DIR}/opprett-meldekortbehandling.sh" "$sak_id" "$kjede_id" "$saksnummer")"
klagebehandling_id="$("${SCRIPT_DIR}/opprett-klage.sh" "$sak_id")"

echo "==================== FERDIG (DIGITAL) ===================="
echo "saksnummer:            ${saksnummer}"
echo "sakId:                 ${sak_id}"
echo "behandlingId:          ${behandling_id}"
echo "meldekortbehandlingId: ${meldekortbehandling_id}"
echo "klagebehandlingId:     ${klagebehandling_id}"
echo "==========================================================="
echo "Hint: Søk opp saksnummer ${saksnummer} i frontend."
