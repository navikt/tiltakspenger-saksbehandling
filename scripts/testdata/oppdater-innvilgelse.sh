#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./_lib.sh
source "${SCRIPT_DIR}/_lib.sh"

usage() {
    echo "Bruk: $(basename "$0") SAK_ID BEHANDLING_ID INTERN_DELTAKELSE_ID [FOM TOM]" >&2
    exit 1
}

[[ $# -eq 3 || $# -eq 5 ]] || usage

sak_id="$1"
behandling_id="$2"
intern_deltakelse_id="$3"
fom="${4:-2025-04-01}"
tom="${5:-2025-04-10}"

require_server
body="$(cat <<JSON
{
  "resultat":"INNVILGELSE",
  "begrunnelseVilkårsvurdering":"test",
  "fritekstTilVedtaksbrev":"test",
  "innvilgelsesperioder":[{"periode":{"fraOgMed":"${fom}","tilOgMed":"${tom}"},"antallDagerPerMeldeperiode":10,"internDeltakelseId":"${intern_deltakelse_id}"}],
  "barnetillegg":{"begrunnelse":null,"perioder":[]},
  "skalSendeVedtaksbrev":true
}
JSON
)"

http_saksbehandler POST "/sak/${sak_id}/behandling/${behandling_id}/oppdater" "$body" >/dev/null
printf '%s\n' "$behandling_id"
