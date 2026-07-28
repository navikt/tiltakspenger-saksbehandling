#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./_lib.sh
source "${SCRIPT_DIR}/_lib.sh"

usage() {
    echo "Bruk: $(basename "$0") SAKSNUMMER [DATO=STATUS ...]" >&2
    echo "Oppretter en korrigerende meldekortbehandling på første kjede og fyller den ut." >&2
    echo "Behandlingen blir stående åpen, slik at simuleringen kan ses i behandlingsbildet." >&2
    echo "Eksempel: $(basename "$0") 202601011001 2025-04-02=DELTATT_UTEN_LØNN_I_TILTAKET 2025-04-03=FRAVÆR_ANNET" >&2
    exit 1
}

[[ $# -ge 1 ]] || usage
require_server

python3 "${SCRIPT_DIR}/_meldekort_flyt.py" korriger "$@"
