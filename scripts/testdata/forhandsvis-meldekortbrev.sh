#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./_lib.sh
source "${SCRIPT_DIR}/_lib.sh"

usage() {
    echo "Bruk: $(basename "$0") SAKSNUMMER MELDEKORTBEHANDLING_ID" >&2
    echo "  Forhåndsviser meldekortvedtaksbrevet for en åpen meldekortbehandling." >&2
    echo "  Dagene fylles ut automatisk (DELTATT_UTEN_LØNN_I_TILTAKET på dager som gir rett)." >&2
    exit 1
}

[[ $# -eq 2 ]] || usage

saksnummer="$1"
meldekortbehandling_id="$2"
require_server

sak_json="$(http_saksbehandler GET "/sak/${saksnummer}")"

sak_id="$(jval "$sak_json" "sakId")"
[[ -n "$sak_id" ]] || fail "Fant ikke sakId for saksnummer ${saksnummer}."

body="$(python3 - "$meldekortbehandling_id" "$sak_json" <<'PY'
import json
import sys

meldekort_id = sys.argv[1]
sak = json.loads(sys.argv[2])

behandling = None
kjede_id = None
for kjede in sak.get("meldeperiodeKjeder", []):
    for kandidat in kjede.get("meldekortbehandlinger", []):
        if kandidat.get("id") == meldekort_id:
            behandling = kandidat
            kjede_id = kjede.get("id")
            break
    if behandling:
        break

if behandling is None:
    print(f"Fant ikke meldekortbehandling {meldekort_id} på saken.", file=sys.stderr)
    sys.exit(1)

dager = [
    {
        "dato": dag["dato"],
        # Uutfylte dager fylles med deltakelse, resten (IKKE_TILTAKSDAG,
        # IKKE_RETT_TIL_TILTAKSPENGER, ...) sendes tilbake uendret.
        "status": "DELTATT_UTEN_LØNN_I_TILTAKET" if dag["status"] == "IKKE_BESVART" else dag["status"],
    }
    for dag in behandling["dager"]
]

print(json.dumps({
    "tekstTilVedtaksbrev": "Dette er en testtekst fra testdata-script.",
    "meldeperioder": [{"kjedeId": kjede_id, "dager": dager}],
}, ensure_ascii=False))
PY
)"

post_og_lagre_pdfer "/sak/${sak_id}/meldekortbehandling/${meldekortbehandling_id}/forhandsvis" "$body" "meldekortvedtaksbrev"
