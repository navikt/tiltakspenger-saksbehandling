#!/usr/bin/env bash
# Oppretter en inngående journalpost med en skannet testsøknad (tema IND) for brukeren i dokarkiv i dev, og skriver ut id-en.
# Journalposten blir liggende som mottatt, og tiltakspenger-journalposthendelser lager en journalføringsoppgave i Gosys i dev, som for en ekte papirsøknad.
# Krever naisdevice, men ingen OBO-tokens.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

[[ $# -eq 1 ]] || {
    echo "Bruk: $(basename "$0") FNR" >&2
    exit 1
}

python3 "${SCRIPT_DIR}/_journalpost.py" opprett "$1"
