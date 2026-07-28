#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./_lib.sh
source "${SCRIPT_DIR}/_lib.sh"

# Lager elleve saker som til sammen dekker simuleringsvisningene:
#
#   1. Ren ytelse       - iverksatt meldekort, simuleringen viser bare ny utbetaling.
#   2. Feilutbetaling   - åpen korrigering som reduserer én dag; flagg og dagmerke for feilutbetaling.
#   3. Justering endags - åpen korrigering som flytter én dag; balansert justering med beløp per dag.
#   4. Justering flerdags - åpen korrigering som flytter to sammenhengende dager; justeringsposteringer
#      over flere dager, der dagmerkene viser perioden i stedet for et beløp (ingen dagsandel finnes).
#   5. Ubalansert justering - åpen korrigering der justeringen ikke balanserer (motposten ligger
#      utenfor behandlingen); iverksetting sperres med faktabærende melding.
#   6. Trekk - åpent førstegangsmeldekort med trekk fra kreditor over flere dager og en
#      reversering av et tidligere trekk (positivt beløp) på siste dag.
#   7. Trekk med justering på tvers av meldeperioder - gjenskaper dev-casen i
#      TrekkMedJusteringFraDevTest: én vanlig innvilgelse over tre meldeperioder, tre
#      førstegangsmeldekort med ~10 % skattetrekk per uke. Tredje meldeperiode krysser
#      månedsskiftet, og da omfordeler oppdrag forrige måneds trekk med justeringer som
#      motpost - balansert i måneden, på tvers av meldeperiodene. Tillates med advarsel.
#   8. Justering over månedsskiftet - justeringen balanserer innenfor meldeperioden, men
#      krysser kalendermåneden. Sperres av månedsgrupperingen i vernet.
#   9. Ytelse flyttet mellom meldeperioder - en dag korrigeres bort i første meldeperiode
#      og motregnes mot en dag som går fra annet fravær til deltatt i den andre; justeringene
#      balanserer i måneden uten feilutbetaling, men ytelsen er flyttet. Sperres fortsatt.
#  10. Feilutbetaling og etterbetaling splittet av månedsskiftet - flytt av en dag på tvers
#      av månedsskiftet i én meldeperiode gir feilutbetaling i én måned og etterbetaling i
#      den andre (slik oppdrag faktisk oppfører seg), uten justering og uten sperre.
#  11. Eksakt dev-case - spiller av de tre innspilte responsene fra
#      TrekkMedJusteringFraDevTest uendret (fnr 99999999906, innvilgelse 04.06.2026-12.07.2026).
#      To iverksatte meldekort og et tredje åpent der oppdrag omfordeler juni-trekket
#      med justeringer på tvers av meldeperiodene. Tillates med advarsel.
#
# Sperre-/trekk-scenarioene trigges av faste test-fødselsnumre som simuleringsfaken i LokalMain kjenner
# igjen (DevSimuleringsscenario i saksbehandling-api). Kjøres scriptet flere ganger gjenbrukes
# personene, så disse to sakene får nye behandlinger i stedet for nye saker.
#
# Justering og feilutbetaling genereres av simuleringsfaken i LokalMain (SimuleringMother):
# en balansert omfordeling innenfor samme meldeperiode og kalendermåned blir JUSTERING,
# en ren reduksjon blir FEILUTBETALING. Trekk og ubalansert justering oppstår hos OS og
# finnes derfor bare som bestilte scenarioer (5 og 6).
#
# Flyttedagene regnes ut fra sakens meldeperiode: de fire første rett-hverdagene som ligger
# i samme kalendermåned, slik at scriptet tåler at seed-periodene endres.

require_server

DELTATT="DELTATT_UTEN_LØNN_I_TILTAKET"
FRAVAER="FRAVÆR_ANNET"

rett_hverdager_i_samme_måned() {
    local saksnummer="$1"
    local kjedeindeks="${2:-0}"
    local sak_json
    sak_json="$(http_saksbehandler GET "/sak/${saksnummer}")"
    python3 - "$sak_json" "$kjedeindeks" <<'PY'
import json
import sys
from datetime import date

sak = json.loads(sys.argv[1])
gir_rett = sak["meldeperiodeKjeder"][int(sys.argv[2])]["sisteMeldeperiode"]["girRett"]
hverdager = sorted(
    d for d, rett in gir_rett.items()
    if rett and date.fromisoformat(d).weekday() < 5
)
måned = date.fromisoformat(hverdager[0]).month
samme_måned = [d for d in hverdager if date.fromisoformat(d).month == måned]
if len(samme_måned) < 4:
    print(f"Trenger minst fire rett-hverdager i samme måned, fant {len(samme_måned)}.", file=sys.stderr)
    sys.exit(1)
print(" ".join(samme_måned[:4]))
PY
}

# Siste rett-hverdag i kjedens første måned og første rett-hverdag i den neste -- for flytt over månedsskiftet.
månedsskiftedager() {
    local saksnummer="$1"
    local kjedeindeks="$2"
    local sak_json
    sak_json="$(http_saksbehandler GET "/sak/${saksnummer}")"
    python3 - "$sak_json" "$kjedeindeks" <<'PY'
import json
import sys
from datetime import date

sak = json.loads(sys.argv[1])
gir_rett = sak["meldeperiodeKjeder"][int(sys.argv[2])]["sisteMeldeperiode"]["girRett"]
hverdager = sorted(d for d, rett in gir_rett.items() if rett and date.fromisoformat(d).weekday() < 5)
måneder = sorted({d[:7] for d in hverdager})
if len(måneder) < 2:
    print("Meldeperioden spenner ikke et månedsskifte.", file=sys.stderr)
    sys.exit(1)
siste_i_første = max(d for d in hverdager if d.startswith(måneder[0]))
første_i_andre = min(d for d in hverdager if d.startswith(måneder[1]))
print(siste_i_første, første_i_andre)
PY
}

ny_sak() {
    "${SCRIPT_DIR}/opprett-innvilget-sak-digital.sh" "$@" | sed -n 's/^SAKSNUMMER=//p'
}

echo "Scenario 1: ren ytelse"
saksnummer_ytelse="$(ny_sak)"
"${SCRIPT_DIR}/fyll-og-iverksett-meldekort.sh" "$saksnummer_ytelse" >/dev/null

echo "Scenario 2: feilutbetaling"
saksnummer_feilutbetaling="$(ny_sak)"
read -r -a dager <<<"$(rett_hverdager_i_samme_måned "$saksnummer_feilutbetaling")"
"${SCRIPT_DIR}/fyll-og-iverksett-meldekort.sh" "$saksnummer_feilutbetaling" >/dev/null
"${SCRIPT_DIR}/opprett-meldekort-korrigering.sh" "$saksnummer_feilutbetaling" "${dager[1]}=${FRAVAER}" >/dev/null

echo "Scenario 3: justering endags"
saksnummer_justering="$(ny_sak)"
read -r -a dager <<<"$(rett_hverdager_i_samme_måned "$saksnummer_justering")"
"${SCRIPT_DIR}/fyll-og-iverksett-meldekort.sh" "$saksnummer_justering" "${dager[1]}=${FRAVAER}" >/dev/null
"${SCRIPT_DIR}/opprett-meldekort-korrigering.sh" "$saksnummer_justering" "${dager[1]}=${DELTATT}" "${dager[2]}=${FRAVAER}" >/dev/null

echo "Scenario 4: justering flerdags"
saksnummer_justering_flerdags="$(ny_sak)"
read -r -a dager <<<"$(rett_hverdager_i_samme_måned "$saksnummer_justering_flerdags")"
"${SCRIPT_DIR}/fyll-og-iverksett-meldekort.sh" "$saksnummer_justering_flerdags" "${dager[0]}=${FRAVAER}" "${dager[1]}=${FRAVAER}" >/dev/null
"${SCRIPT_DIR}/opprett-meldekort-korrigering.sh" "$saksnummer_justering_flerdags" "${dager[0]}=${DELTATT}" "${dager[1]}=${DELTATT}" "${dager[2]}=${FRAVAER}" "${dager[3]}=${FRAVAER}" >/dev/null

echo "Scenario 5: ubalansert justering (sperres)"
saksnummer_ubalansert="$(ny_sak 99999999901)"
read -r -a dager <<<"$(rett_hverdager_i_samme_måned "$saksnummer_ubalansert")"
"${SCRIPT_DIR}/fyll-og-iverksett-meldekort.sh" "$saksnummer_ubalansert" >/dev/null
"${SCRIPT_DIR}/opprett-meldekort-korrigering.sh" "$saksnummer_ubalansert" "${dager[1]}=${FRAVAER}" >/dev/null

echo "Scenario 6: trekk med reversering"
saksnummer_trekk="$(ny_sak 99999999902)"
"${SCRIPT_DIR}/opprett-meldekort-korrigering.sh" "$saksnummer_trekk" >/dev/null

echo "Scenario 7: trekk med justering på tvers av meldeperioder (tillates med advarsel)"
saksnummer_trekkjust="$(ny_sak 99999999913 2025-04-03 2025-05-09)"
"${SCRIPT_DIR}/fyll-og-iverksett-meldekort.sh" "$saksnummer_trekkjust" >/dev/null
"${SCRIPT_DIR}/fyll-og-iverksett-meldekort.sh" "$saksnummer_trekkjust" kjede=1 >/dev/null
"${SCRIPT_DIR}/opprett-meldekort-korrigering.sh" "$saksnummer_trekkjust" kjede=2 >/dev/null

echo "Scenario 8: justering over månedsskiftet (sperres)"
saksnummer_maanedsskifte="$(ny_sak 99999999904 2025-04-14 2025-05-08)"
read -r aprildag maidag <<<"$(månedsskiftedager "$saksnummer_maanedsskifte" 1)"
"${SCRIPT_DIR}/fyll-og-iverksett-meldekort.sh" "$saksnummer_maanedsskifte" >/dev/null
"${SCRIPT_DIR}/fyll-og-iverksett-meldekort.sh" "$saksnummer_maanedsskifte" kjede=1 "${aprildag}=${FRAVAER}" >/dev/null
"${SCRIPT_DIR}/opprett-meldekort-korrigering.sh" "$saksnummer_maanedsskifte" kjede=1 "${aprildag}=${DELTATT}" "${maidag}=${FRAVAER}" >/dev/null

echo "Scenario 9: ytelse flyttet mellom meldeperioder (sperres)"
saksnummer_flytt="$(ny_sak 99999999905 2025-04-01 2025-04-24)"
read -r -a dager <<<"$(rett_hverdager_i_samme_måned "$saksnummer_flytt" 1)"
"${SCRIPT_DIR}/fyll-og-iverksett-meldekort.sh" "$saksnummer_flytt" >/dev/null
"${SCRIPT_DIR}/fyll-og-iverksett-meldekort.sh" "$saksnummer_flytt" kjede=1 "${dager[1]}=${FRAVAER}" >/dev/null
"${SCRIPT_DIR}/opprett-meldekort-korrigering.sh" "$saksnummer_flytt" kjede=1 "${dager[1]}=${DELTATT}" >/dev/null

echo "Scenario 10: feilutbetaling og etterbetaling splittet av månedsskiftet"
saksnummer_splitt="$(ny_sak "" 2025-04-14 2025-05-08)"
read -r aprildag maidag <<<"$(månedsskiftedager "$saksnummer_splitt" 1)"
"${SCRIPT_DIR}/fyll-og-iverksett-meldekort.sh" "$saksnummer_splitt" >/dev/null
"${SCRIPT_DIR}/fyll-og-iverksett-meldekort.sh" "$saksnummer_splitt" kjede=1 "${aprildag}=${FRAVAER}" >/dev/null
"${SCRIPT_DIR}/opprett-meldekort-korrigering.sh" "$saksnummer_splitt" kjede=1 "${aprildag}=${DELTATT}" "${maidag}=${FRAVAER}" >/dev/null

echo "Scenario 11: eksakt dev-case, trekk med justering (tillates med advarsel)"
saksnummer_eksakt="$(ny_sak 99999999906 2026-06-04 2026-07-12)"
"${SCRIPT_DIR}/fyll-og-iverksett-meldekort.sh" "$saksnummer_eksakt" >/dev/null
"${SCRIPT_DIR}/fyll-og-iverksett-meldekort.sh" "$saksnummer_eksakt" kjede=1 >/dev/null
"${SCRIPT_DIR}/opprett-meldekort-korrigering.sh" "$saksnummer_eksakt" kjede=2 >/dev/null

echo
echo "Ren ytelse:           ${saksnummer_ytelse}"
echo "Feilutbetaling:       ${saksnummer_feilutbetaling}"
echo "Justering endags:     ${saksnummer_justering}"
echo "Justering flerdags:   ${saksnummer_justering_flerdags}"
echo "Ubalansert justering: ${saksnummer_ubalansert}"
echo "Trekk:                ${saksnummer_trekk}"
echo "Trekk+just. på tvers: ${saksnummer_trekkjust}"
echo "Flyttet ytelse:       ${saksnummer_flytt}"
echo "Just. månedsskifte:   ${saksnummer_maanedsskifte}"
echo "Feilutb./etterb. splitt: ${saksnummer_splitt}"
echo "Eksakt dev-case:      ${saksnummer_eksakt}"
echo
echo "Søk opp saksnumrene i frontend. Korrigeringene står åpne, så simuleringen vises i behandlingsbildet."
