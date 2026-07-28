#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./_lib.sh
source "${SCRIPT_DIR}/_lib.sh"

usage() {
    echo "Bruk: $(basename "$0") SAKSNUMMER [DATO=STATUS ...]" >&2
    echo "Oppretter meldekortbehandling på første kjede, fyller ut, sender til beslutning og iverksetter." >&2
    echo "Uten overrides: rett-hverdager DELTATT_UTEN_LØNN_I_TILTAKET, helg IKKE_TILTAKSDAG." >&2
    echo "Eksempel: $(basename "$0") 202601011001 2025-04-02=FRAVÆR_ANNET" >&2
    exit 1
}

[[ $# -ge 1 ]] || usage
require_server

python3 "${SCRIPT_DIR}/_meldekort_flyt.py" iverksett "$@"
