#!/usr/bin/env bash
# Skriver ut en journalpost i SAF i dev som tilhører brukeren, til bruk ved papirsøknad.
# Søknader med tema IND foretrekkes; ellers velges den nyeste journalposten.
# Krever naisdevice, men ingen OBO-tokens.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

[[ $# -eq 1 ]] || {
    echo "Bruk: $(basename "$0") FNR" >&2
    exit 1
}

python3 "${SCRIPT_DIR}/_journalpost.py" finn "$1"
