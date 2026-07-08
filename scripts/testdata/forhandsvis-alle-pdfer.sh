#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./_lib.sh
source "${SCRIPT_DIR}/_lib.sh"

usage() {
    echo "Bruk: $(basename "$0")" >&2
    echo "  Oppretter en innvilget sak (digital) og forhåndsviser alle PDF-brevene" >&2
    echo "  som kan hentes via routes. PDF-ene lagres i \$PDF_UT_DIR" >&2
    echo "  (default /tmp/tiltakspenger-pdfer)." >&2
    echo "  Krever at pdfgen (8081) og pdfgenrs (8084) kjører i docker." >&2
    exit 1
}

[[ $# -eq 0 ]] || usage
require_server

log "Oppretter innvilget sak (digital)..."
output="$("${SCRIPT_DIR}/opprett-innvilget-sak-digital.sh")"
saksnummer=""
sak_id=""
soknadsbehandling_id=""
while IFS='=' read -r key value; do
    case "$key" in
    SAKSNUMMER) saksnummer="$value" ;;
    SAK_ID) sak_id="$value" ;;
    BEHANDLING_ID) soknadsbehandling_id="$value" ;;
    esac
done <<<"$output"

[[ -n "$saksnummer" && -n "$sak_id" && -n "$soknadsbehandling_id" ]] ||
    fail "Mangler saksnummer/sakId/behandlingId fra opprett-innvilget-sak-digital.sh."

intern_deltakelse_id="$("${SCRIPT_DIR}/hent-sak.sh" "$saksnummer" "behandlinger[0].saksopplysninger.tiltaksdeltagelse[0].internDeltakelseId")"
rammevedtak_id="$("${SCRIPT_DIR}/hent-sak.sh" "$saksnummer" "alleRammevedtak[0].id")"

# Ett brev som feiler (f.eks. en ødelagt mal) skal ikke stoppe resten av testene.
feilede_brev=()
forhandsvis() {
    local navn="$1"
    shift
    if ! "$@"; then
        feilede_brev+=("$navn")
        log "FEIL: forhåndsvisning av ${navn} feilet — fortsetter med neste brev."
    fi
}

log "Forhåndsviser vedtaksbrev for søknadsbehandling (innvilgelse + avslag)..."
forhandsvis "vedtaksbrev innvilgelse" "${SCRIPT_DIR}/forhandsvis-vedtaksbrev.sh" "$sak_id" "$soknadsbehandling_id" INNVILGELSE "$intern_deltakelse_id"
forhandsvis "vedtaksbrev avslag" "${SCRIPT_DIR}/forhandsvis-vedtaksbrev.sh" "$sak_id" "$soknadsbehandling_id" AVSLAG

log "Starter stans-revurdering og forhåndsviser stansvedtaksbrev..."
read -r stans_behandling_id _ <<<"$("${SCRIPT_DIR}/start-revurdering.sh" "$sak_id" STANS)"
forhandsvis "stansvedtaksbrev" "${SCRIPT_DIR}/forhandsvis-vedtaksbrev.sh" "$sak_id" "$stans_behandling_id" STANS

log "Starter revurdering innvilgelse og forhåndsviser brev..."
read -r revurdering_behandling_id revurdering_deltakelse_id <<<"$("${SCRIPT_DIR}/start-revurdering.sh" "$sak_id" REVURDERING_INNVILGELSE)"
forhandsvis "vedtaksbrev revurdering innvilgelse" "${SCRIPT_DIR}/forhandsvis-vedtaksbrev.sh" "$sak_id" "$revurdering_behandling_id" REVURDERING_INNVILGELSE "${revurdering_deltakelse_id:-$intern_deltakelse_id}"

log "Oppretter meldekortbehandling og forhåndsviser meldekortvedtaksbrev..."
kjede_id="$("${SCRIPT_DIR}/hent-sak.sh" "$saksnummer" "meldeperiodeKjeder[0].id")"
meldekortbehandling_id="$("${SCRIPT_DIR}/opprett-meldekortbehandling.sh" "$sak_id" "$kjede_id" "$saksnummer")"
forhandsvis "meldekortvedtaksbrev" "${SCRIPT_DIR}/forhandsvis-meldekortbrev.sh" "$saksnummer" "$meldekortbehandling_id"

log "Oppretter klage uten påklaget vedtak og forhåndsviser avvisningsbrev..."
klage_avvisning_id="$("${SCRIPT_DIR}/opprett-klage.sh" "$sak_id")"
forhandsvis "klagebrev avvisning" "${SCRIPT_DIR}/forhandsvis-klagebrev.sh" "$sak_id" "$klage_avvisning_id" "klagebrev-avvisning"

log "Oppretter klage på rammevedtaket, opprettholder og forhåndsviser innstillingsbrev..."
klage_innstilling_id="$("${SCRIPT_DIR}/opprett-klage.sh" "$sak_id" "$rammevedtak_id")"
"${SCRIPT_DIR}/vurder-klage-oppretthold.sh" "$sak_id" "$klage_innstilling_id" >/dev/null
forhandsvis "klagebrev innstilling" "${SCRIPT_DIR}/forhandsvis-klagebrev.sh" "$sak_id" "$klage_innstilling_id" "klagebrev-innstilling"

log "Starter omgjøring av rammevedtaket og forhåndsviser omgjøringsbrev (innvilgelse + opphør)..."
read -r omgjoring_behandling_id omgjoring_deltakelse_id <<<"$("${SCRIPT_DIR}/start-revurdering.sh" "$sak_id" OMGJØRING "$rammevedtak_id")"
forhandsvis "omgjøringsbrev innvilgelse" "${SCRIPT_DIR}/forhandsvis-vedtaksbrev.sh" "$sak_id" "$omgjoring_behandling_id" OMGJØRING "${omgjoring_deltakelse_id:-$intern_deltakelse_id}"
forhandsvis "omgjøringsbrev opphør" "${SCRIPT_DIR}/forhandsvis-vedtaksbrev.sh" "$sak_id" "$omgjoring_behandling_id" OMGJØRING_OPPHØR

echo "==================== FERDIG (PDF-ER) ===================="
echo "saksnummer:  ${saksnummer}"
echo "sakId:       ${sak_id}"
echo "PDF-er:      ${PDF_UT_DIR}"
ls -1 "${PDF_UT_DIR}" | sed 's/^/  - /'
if [[ ${#feilede_brev[@]} -gt 0 ]]; then
    echo "FEILET (${#feilede_brev[@]}):"
    printf '  - %s\n' "${feilede_brev[@]}"
fi
echo "========================================================="
echo "Hint: åpne katalogen (open ${PDF_UT_DIR}) og sammenlign *-pdfgen.pdf mot *-pdfgenrs.pdf."
[[ ${#feilede_brev[@]} -eq 0 ]]
