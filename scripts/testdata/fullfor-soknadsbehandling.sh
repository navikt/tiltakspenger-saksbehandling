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

pinned_id_set="${SOKNADSBEHANDLING_ID+x}"
pinned_id="${SOKNADSBEHANDLING_ID-}"

# Skriver SAK_ID BEHANDLING_ID STATUS INTERN_DELTAKELSE_ID FOM TOM for valgt søknadsbehandling.
nyeste_søknadsbehandling() {
    local sak_json
    sak_json="$(http_saksbehandler GET "/sak/${saksnummer}")" || return 1
    python3 - "$sak_json" "$pinned_id_set" "$pinned_id" <<'PY'
import json
import sys

sak = json.loads(sys.argv[1])
if sys.argv[2]:
    pinned_id = sys.argv[3]
    if not pinned_id:
        print("FEIL: SOKNADSBEHANDLING_ID kan ikke være tom.", file=sys.stderr)
        sys.exit(1)
    behandlinger = [
        behandling for behandling in sak["rammebehandlinger"]
        if behandling.get("id") == pinned_id
    ]
    if not behandlinger:
        print(f"FEIL: Behandling {pinned_id} finnes ikke på saken.", file=sys.stderr)
        sys.exit(1)
    if len(behandlinger) != 1:
        print(f"FEIL: Behandling {pinned_id} finnes flere ganger på saken.", file=sys.stderr)
        sys.exit(1)
    b = behandlinger[0]
    if b.get("type") != "SØKNADSBEHANDLING":
        print(f"FEIL: Behandling {pinned_id} er ikke en SØKNADSBEHANDLING.", file=sys.stderr)
        sys.exit(1)
else:
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
    if ! behandling_info="$(nyeste_søknadsbehandling)"; then
        exit 1
    fi
    read -r sak_id behandling_id status intern_deltakelse_id deltakelse_fom deltakelse_tom <<<"$behandling_info"
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
