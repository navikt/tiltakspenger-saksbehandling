#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./_lib.sh
source "${SCRIPT_DIR}/_lib.sh"

usage() {
    echo "Bruk: $(basename "$0") [FANE ...]" >&2
    echo "FANE: soknader | revurderinger | meldekort | klage | tilbakekreving (default: soknader revurderinger meldekort)" >&2
    echo "Skriver én linje per rad på benken: SAKSNUMMER FNR OPPDRAGSVERSJON FANE STATUS." >&2
    echo "Rader med fnr utenfor den syntetiske serien hoppes over uten å skrives ut." >&2
    exit 1
}

[[ "${1:-}" != "-h" && "${1:-}" != "--help" ]] || usage
require_server

# Dev fikk V3 for nye saker 2026-11-10 kl. 15, og saksnummeret starter med opprettelsesdatoen.
# Saker fra selve dagen kan være begge deler.
FORSTE_V3_DAG="${FORSTE_V3_DAG:-20261111}"
DAGEN_V3_KOM="${DAGEN_V3_KOM:-20261110}"

faner=("$@")
[[ ${#faner[@]} -gt 0 ]] || faner=(soknader revurderinger meldekort)

for fane in "${faner[@]}"; do
    side=0
    while :; do
        respons="$(http_saksbehandler POST "/benk/${fane}" "{\"side\":${side}}")"
        linjer="$(python3 - "$respons" "$fane" "$FORSTE_V3_DAG" "$DAGEN_V3_KOM" <<'PY'
import json, re, sys
data, fane, første_v3, overgang = json.loads(sys.argv[1]), sys.argv[2], sys.argv[3], sys.argv[4]
oversikt = data.get("oversikt") or {}
hoppet_over = 0
for rad in oversikt.get("behandlinger", []):
    fnr = (rad.get("fnr") or {}).get("verdi")
    saksnummer = (rad.get("saksnummer") or {}).get("verdi")
    if not fnr or not saksnummer or not re.fullmatch(r"\d{2}[4-9]\d{8}", fnr):
        hoppet_over += 1
        continue
    dag = saksnummer[:8]
    versjon = "V3" if dag >= første_v3 else ("V2/V3" if dag == overgang else "V2")
    print(saksnummer, fnr, versjon, fane, rad.get("status", "-"))
antall = oversikt.get("totalAntall", 0)
sideantall = oversikt.get("sideantall", 1) or 1
side = oversikt.get("side", 0)
print(f"#NESTE {side + 1 if (side + 1) * sideantall < antall else -1} {hoppet_over}")
PY
)"
        grep -v '^#NESTE' <<<"$linjer" || true
        read -r _ neste hoppet_over <<<"$(grep '^#NESTE' <<<"$linjer")"
        ((hoppet_over == 0)) || log "${fane} side ${side}: hoppet over ${hoppet_over} rader uten syntetisk fnr."
        ((neste >= 0)) || break
        side="$neste"
    done
done
