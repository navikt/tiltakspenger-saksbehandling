#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./_lib.sh
source "${SCRIPT_DIR}/_lib.sh"

usage() {
    echo "Bruk: $(basename "$0") SAK_ID BEHANDLING_ID RESULTAT [INTERN_DELTAKELSE_ID]" >&2
    echo "  RESULTAT: INNVILGELSE | AVSLAG | STANS | REVURDERING_INNVILGELSE | OMGJØRING | OMGJØRING_OPPHØR" >&2
    echo "  INTERN_DELTAKELSE_ID er påkrevd for INNVILGELSE, REVURDERING_INNVILGELSE og OMGJØRING." >&2
    echo "  Lagrer PDF-en(e) i \$PDF_UT_DIR (default /tmp/tiltakspenger-pdfer) og skriver ut stiene." >&2
    exit 1
}

[[ $# -ge 3 && $# -le 4 ]] || usage

sak_id="$1"
behandling_id="$2"
resultat="$3"
intern_deltakelse_id="${4:-}"
require_server

fritekst="Fritekst til vedtaksbrev fra testdata-script."
periode='{"fraOgMed":"2025-04-01","tilOgMed":"2025-04-10"}'
innvilgelsesperioder="[{\"periode\":${periode},\"antallDagerPerMeldeperiode\":10,\"internDeltakelseId\":\"${intern_deltakelse_id}\"}]"

case "$resultat" in
INNVILGELSE | REVURDERING_INNVILGELSE | OMGJØRING)
    [[ -n "$intern_deltakelse_id" ]] || usage
    body="{\"resultat\":\"${resultat}\",\"fritekst\":\"${fritekst}\",\"barnetillegg\":null,\"innvilgelsesperioder\":${innvilgelsesperioder}}"
    ;;
AVSLAG)
    body="{\"resultat\":\"AVSLAG\",\"fritekst\":\"${fritekst}\",\"avslagsgrunner\":[\"FremmetForSent\"]}"
    ;;
STANS)
    body="{\"resultat\":\"STANS\",\"fritekst\":\"${fritekst}\",\"harValgtStansFraFørsteDagSomGirRett\":true,\"stansFraOgMed\":null,\"valgteHjemler\":[\"DeltarIkkePåArbeidsmarkedstiltak\"]}"
    ;;
OMGJØRING_OPPHØR)
    body="{\"resultat\":\"OMGJØRING_OPPHØR\",\"fritekst\":\"${fritekst}\",\"vedtaksperiode\":${periode},\"valgteHjemler\":[\"DeltarIkkePåArbeidsmarkedstiltak\"]}"
    ;;
*) usage ;;
esac

post_og_lagre_pdfer "/sak/${sak_id}/behandling/${behandling_id}/forhandsvis" "$body" "vedtaksbrev-${resultat}"
