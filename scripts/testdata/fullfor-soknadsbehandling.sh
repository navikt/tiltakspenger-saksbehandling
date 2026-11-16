#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./_lib.sh
source "${SCRIPT_DIR}/_lib.sh"

usage() {
    echo "Bruk: $(basename "$0") SAKSNUMMER [FOM TOM]" >&2
    echo "Fører den nyeste søknadsbehandlingen på saken fram til vedtak, også når den er under automatisk behandling." >&2
    echo "Må saksbehandler fylle ut, innvilges hele tiltaksdeltakelsen, eller FOM-TOM om de er oppgitt." >&2
    exit 1
}

[[ $# -eq 1 || $# -eq 3 ]] || usage
saksnummer="$1"
fom="${2:-}"
tom="${3:-}"
require_server

# Skriver SAK_ID BEHANDLING_ID STATUS INTERN_DELTAKELSE_ID FOM TOM for den nyeste søknadsbehandlingen.
nyeste_søknadsbehandling() {
    python3 - "$(http_saksbehandler GET "/sak/${saksnummer}")" <<'PY'
import json, sys
sak = json.loads(sys.argv[1])
behandlinger = sorted(
    (b for b in sak["rammebehandlinger"] if b["type"] == "SØKNADSBEHANDLING"),
    key=lambda b: b["opprettet"],
)
if not behandlinger:
    print(sak["sakId"], "-", "INGEN", "-", "-", "-")
    sys.exit(0)
b = behandlinger[-1]
deltakelser = b["saksopplysninger"].get("tiltaksdeltagelse") or [{}]
d = deltakelser[0]
periode = d.get("periode") or {}
print(sak["sakId"], b["id"], b["status"], d.get("internDeltakelseId") or "-", periode.get("fraOgMed") or "-", periode.get("tilOgMed") or "-")
PY
}

ta() {
    local token_fn="$1"
    "$token_fn" POST "/behandlinger/ta" "{\"behandlinger\":[{\"behandlingId\":\"${behandling_id}\",\"sakId\":\"${sak_id}\"}]}" >/dev/null
}

for _ in $(seq 1 60); do
    read -r sak_id behandling_id status intern_deltakelse_id deltakelse_fom deltakelse_tom <<<"$(nyeste_søknadsbehandling)"
    log "Søknadsbehandling ${behandling_id}: ${status}"
    case "$status" in
    INGEN | UNDER_AUTOMATISK_BEHANDLING) sleep 10 ;;
    KLAR_TIL_BEHANDLING) ta http_saksbehandler ;;
    UNDER_BEHANDLING)
        [[ "$intern_deltakelse_id" != "-" ]] || fail "Behandlingen har ingen tiltaksdeltakelse."
        [[ -n "$fom" ]] || fom="$deltakelse_fom"
        [[ -n "$tom" ]] || tom="$deltakelse_tom"
        [[ "$fom" != "-" && "$tom" != "-" ]] || fail "Tiltaksdeltakelsen mangler fra- eller til-dato; oppgi FOM og TOM."
        "${SCRIPT_DIR}/oppdater-innvilgelse.sh" "$sak_id" "$behandling_id" "$intern_deltakelse_id" "$fom" "$tom" >/dev/null
        "${SCRIPT_DIR}/send-til-beslutning.sh" "$sak_id" "$behandling_id" >/dev/null
        ;;
    KLAR_TIL_BESLUTNING) ta http_beslutter ;;
    UNDER_BESLUTNING) "${SCRIPT_DIR}/iverksett.sh" "$sak_id" "$behandling_id" >/dev/null ;;
    VEDTATT)
        printf 'SAKSNUMMER=%s\nSAK_ID=%s\nBEHANDLING_ID=%s\n' "$saksnummer" "$sak_id" "$behandling_id"
        exit 0
        ;;
    *) fail "Søknadsbehandlingen har status ${status}." ;;
    esac
done
fail "Søknadsbehandlingen ble ikke vedtatt innen 10 minutter."
