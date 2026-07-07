#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./_lib.sh
source "${SCRIPT_DIR}/_lib.sh"

usage() {
    echo "Bruk: $(basename "$0") SAKSNUMMER [SOKNADSTYPE]" >&2
    echo "SOKNADSTYPE: PAPIR_SKJEMA (default), PAPIR_FRIHAND eller DIGITAL" >&2
    exit 1
}

[[ $# -ge 1 && $# -le 2 ]] || usage

saksnummer="$1"
soknadstype="${2:-PAPIR_SKJEMA}"

case "$soknadstype" in
PAPIR_SKJEMA | PAPIR_FRIHAND | DIGITAL) ;;
*) fail "Ugyldig SOKNADSTYPE: $soknadstype" ;;
esac

require_server
ekstern_deltakelse_id="$(python3 - <<'PY'
import uuid

print(uuid.uuid4())
PY
)"

build_body() {
    local ekstern_id="$1"
    cat <<JSON
{
  "journalpostId": "12345",
  "manueltSattSøknadsperiode": {"fraOgMed":"2025-04-01","tilOgMed":"2025-04-10"},
  "manueltSattTiltak": null,
  "antallVedlegg": 0,
  "søknadstype": "${soknadstype}",
  "behandlingsarsak": null,
  "svar": {
    "tiltak": {
      "eksternDeltakelseId": "${ekstern_id}",
      "deltakelseFraOgMed": "2025-04-01",
      "deltakelseTilOgMed": "2025-04-10",
      "typeKode": "GRUPPE_AMO",
      "typeNavn": "Gruppe AMO"
    },
    "barnetilleggPdl": [],
    "barnetilleggManuelle": [],
    "harSøktPåTiltak": {"svar":"JA"},
    "harSøktOmBarnetillegg": {"svar":"NEI"},
    "kvp": {"svar":"NEI","fraOgMed":null,"tilOgMed":null},
    "intro": {"svar":"NEI","fraOgMed":null,"tilOgMed":null},
    "institusjon": {"svar":"NEI","fraOgMed":null,"tilOgMed":null},
    "etterlønn": {"svar":"NEI"},
    "gjenlevendepensjon": {"svar":"NEI","fraOgMed":null,"tilOgMed":null},
    "alderspensjon": {"svar":"NEI","fraOgMed":null},
    "sykepenger": {"svar":"NEI","fraOgMed":null,"tilOgMed":null},
    "supplerendeStønadAlder": {"svar":"NEI","fraOgMed":null,"tilOgMed":null},
    "supplerendeStønadFlyktning": {"svar":"NEI","fraOgMed":null,"tilOgMed":null},
    "jobbsjansen": {"svar":"NEI","fraOgMed":null,"tilOgMed":null},
    "trygdOgPensjon": {"svar":"NEI","fraOgMed":null,"tilOgMed":null}
  }
}
JSON
}

body="$(build_body "$ekstern_deltakelse_id")"
response="$(http_saksbehandler POST "/sak/${saksnummer}/soknad" "$body")"
behandling_id="$(jval "$response" "id")"
intern_deltakelse_id="$(jval "$response" "saksopplysninger.tiltaksdeltagelse[0].internDeltakelseId" 2>/dev/null || true)"
if [[ -z "$intern_deltakelse_id" ]]; then
    log "Fant ikke internDeltakelseId for tilfeldig eksternDeltakelseId. Prøver med kjent fake-id."
    body="$(build_body "fa287e7-ddbb-44a2-9bfa-4da4661f8b6d")"
    response="$(http_saksbehandler POST "/sak/${saksnummer}/soknad" "$body")"
    behandling_id="$(jval "$response" "id")"
    intern_deltakelse_id="$(jval "$response" "saksopplysninger.tiltaksdeltagelse[0].internDeltakelseId" 2>/dev/null || true)"
fi

[[ -n "$behandling_id" ]] || fail "Mangler behandlingId i responsen."
[[ -n "$intern_deltakelse_id" ]] || fail "Mangler internDeltakelseId i responsen."
printf '%s %s\n' "$behandling_id" "$intern_deltakelse_id"
