#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MILJO=dev
# shellcheck source=./_lib.sh
source "${SCRIPT_DIR}/_lib.sh"

usage() {
    echo "Bruk: $(basename "$0") FNR|SAKSNUMMER [TILTAKSINDEKS]" >&2
    echo "Kjører utbetalingscasene for Hel Ved v3 mot dev på én bruker, steg for steg:" >&2
    echo "  1. søknad (bare med FNR) og innvilgelse av hele tiltaksdeltakelsen" >&2
    echo "  2. meldekort for første meldeperiode med full deltakelse: første utbetaling" >&2
    echo "  3. meldekort for andre meldeperiode med én dag annet fravær: ny meldeperiode med redusert beløp" >&2
    echo "  4. korrigering av første meldeperiode med én dag annet fravær: feilutbetaling" >&2
    echo "  5. korrigering av andre meldeperiode med fraværsdagen som deltatt: etterbetaling" >&2
    echo "  6. stans fra andre meldeperiode: opphør av en utbetalt periode" >&2
    echo "Tiltaket må ha startet minst fire uker tilbake, ellers er ikke meldeperiodene klare til behandling." >&2
    echo "Saken må være opprettet etter at dev fikk V3 (saksnummer fra 20261111); se finn-testbrukere.sh." >&2
    exit 1
}

[[ $# -ge 1 && $# -le 2 ]] || usage
require_server

if [[ "$1" =~ ^[0-9]{11}$ ]]; then
    saksnummer="$("${SCRIPT_DIR}/send-soknad-dev.sh" "$1" "${2:-0}" | sed -n 's/^SAKSNUMMER=//p')"
else
    saksnummer="$1"
    krev_syntetisk_fnr "$(jval "$(http_saksbehandler GET "/sak/${saksnummer}")" "fnr.verdi")"
fi
((10#${saksnummer:0:8} > 20261110)) || log "ADVARSEL: Sak ${saksnummer} er trolig opprettet før V3 og utbetales med V2."

DELTATT="DELTATT_UTEN_LØNN_I_TILTAKET"
FRAVAER="FRAVÆR_ANNET"

log "Steg 1: innvilgelse"
"${SCRIPT_DIR}/fullfor-soknadsbehandling.sh" "$saksnummer" >/dev/null

# Andre rett-hverdag i kjeden, så første dag fortsatt gir utbetaling.
fraværsdag() {
    local sak_json
    sak_json="$(http_saksbehandler GET "/sak/${saksnummer}")"
    python3 -c '
import json, sys
from datetime import date
gir_rett = json.loads(sys.argv[2])["meldeperiodeKjeder"][int(sys.argv[1])]["sisteMeldeperiode"]["girRett"]
print(sorted(d for d, r in gir_rett.items() if r and date.fromisoformat(d).weekday() < 5)[1])
' "$1" "$sak_json"
}

# Steg 2 og 3 hoppes over når kjeden allerede har en godkjent behandling, så en ny kjøring ikke lager ekstra korrigeringer.
er_godkjent() {
    local sak_json
    sak_json="$(http_saksbehandler GET "/sak/${saksnummer}")"
    python3 -c '
import json, sys
sak = json.loads(sys.argv[2])
kjede = sak["meldeperiodeKjeder"][int(sys.argv[1])]
statuser = [sak["meldekortbehandlinger"][i]["status"] for i in kjede["meldekortbehandlingIder"]]
sys.exit(0 if {"GODKJENT", "AUTOMATISK_BEHANDLET"} & set(statuser) else 1)
' "$1" "$sak_json"
}

log "Steg 2: første utbetaling"
er_godkjent 0 || "${SCRIPT_DIR}/fyll-og-iverksett-meldekort.sh" "$saksnummer" kjede=0 >/dev/null

log "Steg 3: ny meldeperiode med én dag fravær"
dag_kjede_1="$(fraværsdag 1)"
er_godkjent 1 || "${SCRIPT_DIR}/fyll-og-iverksett-meldekort.sh" "$saksnummer" kjede=1 "${dag_kjede_1}=${FRAVAER}" >/dev/null

log "Steg 4: korrigering som gir feilutbetaling"
dag_kjede_0="$(fraværsdag 0)"
"${SCRIPT_DIR}/fyll-og-iverksett-meldekort.sh" "$saksnummer" kjede=0 "${dag_kjede_0}=${FRAVAER}" >/dev/null

log "Steg 5: korrigering som gir etterbetaling"
"${SCRIPT_DIR}/fyll-og-iverksett-meldekort.sh" "$saksnummer" kjede=1 "${dag_kjede_1}=${DELTATT}" >/dev/null

log "Steg 6: stans fra andre meldeperiode"
sak_json="$(http_saksbehandler GET "/sak/${saksnummer}")"
sak_id="$(jval "$sak_json" "sakId")"
stans_fra="$(jval "$sak_json" "meldeperiodeKjeder[1].periode.fraOgMed")"
read -r stans_id _ <<<"$("${SCRIPT_DIR}/start-revurdering.sh" "$sak_id" STANS)"
http_saksbehandler POST "/sak/${sak_id}/behandling/${stans_id}/oppdater" "$(cat <<JSON
{
  "resultat":"STANS",
  "begrunnelseVilkårsvurdering":"test",
  "fritekstTilVedtaksbrev":"test",
  "valgteHjemler":["DeltarIkkePåArbeidsmarkedstiltak"],
  "harValgtStansFraFørsteDagSomGirRett":false,
  "stansFraOgMed":"${stans_fra}",
  "skalSendeVedtaksbrev":false
}
JSON
)" >/dev/null
"${SCRIPT_DIR}/send-til-beslutning.sh" "$sak_id" "$stans_id" >/dev/null
"${SCRIPT_DIR}/ta-behandling.sh" "$sak_id" "$stans_id" >/dev/null
"${SCRIPT_DIR}/iverksett.sh" "$sak_id" "$stans_id" >/dev/null

echo "SAKSNUMMER=${saksnummer}"
echo "Kontroller utbetalingene i Utbetalingsportalen: https://utbetalingsportalen.intern.dev.nav.no/oppdragsinfo/oppdrag"
echo "og i Peisen: https://peisen.intern.dev.nav.no/"
