#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./_lib.sh
source "${SCRIPT_DIR}/_lib.sh"

usage() {
    echo "Bruk: $(basename "$0") SAK_ID KLAGEBEHANDLING_ID [NAVN]" >&2
    echo "  Hvilket brev som genereres avhenger av klagebehandlingens tilstand:" >&2
    echo "  - avvisning (formkrav ikke oppfylt / ikke noe påklaget vedtak) -> avvisningsbrev" >&2
    echo "  - opprettholdt (etter vurder-klage-oppretthold.sh) -> innstillingsbrev" >&2
    echo "  NAVN er filprefix (default 'klagebrev')." >&2
    exit 1
}

[[ $# -ge 2 && $# -le 3 ]] || usage

sak_id="$1"
klagebehandling_id="$2"
navn="${3:-klagebrev}"
require_server

body='{"tekstTilVedtaksbrev":[{"tittel":"Om klagen","tekst":"Dette er en testtekst fra testdata-script."}]}'

post_og_lagre_pdfer "/sak/${sak_id}/klage/${klagebehandling_id}/forhandsvis" "$body" "$navn"
