#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./_lib.sh
source "${SCRIPT_DIR}/_lib.sh"

usage() {
    echo "Bruk: $(basename "$0") SAKSNUMMER [SOKNADSTYPE]" >&2
    echo "SOKNADSTYPE: PAPIR_SKJEMA (default), PAPIR_FRIHAND eller DIGITAL" >&2
    echo "JOURNALPOST_ID overstyrer journalposten. Lokalt er standard 12345; i dev hentes brukerens journalpost fra SAF med finn-journalpost.sh." >&2
    echo "SOKNAD_MOTTATT_DATO (YYYY-MM-DD) er datoen søknaden ble mottatt; standard er tiltakets startdato, så søknaden kommer innenfor tremånedersfristen." >&2
    echo "I dev gjelder søknaden hele tiltaket med indeks TILTAKSINDEKS (default 0) fra GET /tiltak i soknad-api; lokalt brukes et fiktivt tiltak." >&2
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

if [[ $MILJO == dev ]]; then
    fnr="$(jval "$(http_saksbehandler GET "/sak/${saksnummer}")" "fnr.verdi")"
fi

if [[ -z ${JOURNALPOST_ID:-} ]]; then
    if [[ $MILJO == dev ]]; then
        JOURNALPOST_ID="$("${SCRIPT_DIR}/finn-journalpost.sh" "$fnr")" ||
            fail "Fant ingen journalpost for brukeren. Lag en med ${SCRIPT_DIR}/opprett-journalpost.sh FNR, eller sett JOURNALPOST_ID."
    else
        JOURNALPOST_ID=12345
    fi
fi
if [[ $MILJO == dev ]]; then
    read -r ekstern_deltakelse_id tiltak_fra tiltak_til tiltakskode tiltak_typenavn < <(python3 - "$(hent_tiltak_dev "$fnr")" "${TILTAKSINDEKS:-0}" <<'PY'
import json, sys
tiltak = json.loads(sys.argv[1]).get("tiltak", [])
indeks = int(sys.argv[2])
if indeks >= len(tiltak):
    print(f"Brukeren har {len(tiltak)} tiltak som gir rett, fant ikke indeks {indeks}.", file=sys.stderr)
    sys.exit(1)
t = tiltak[indeks]
periode = t.get("arenaRegistrertPeriode") or t.get("periode") or {}
if not periode.get("fra") or not periode.get("til"):
    print("Tiltaket mangler fra- eller til-dato og kan ikke søkes på fra scriptet.", file=sys.stderr)
    sys.exit(1)
print(t["aktivitetId"], periode["fra"], periode["til"], t["type"], t["typeNavn"].replace("\n", " "))
PY
    ) || fail "Fant ikke noe tiltak å søke på for brukeren."
else
    ekstern_deltakelse_id="$(python3 -c 'import uuid; print(uuid.uuid4())')"
    tiltak_fra=2025-04-01
    tiltak_til=2025-04-10
    tiltakskode=GRUPPEAMO
    tiltak_typenavn="Gruppe AMO"
fi

build_body() {
    local ekstern_id="$1"
    cat <<JSON
{
  "journalpostId": "${JOURNALPOST_ID}",
  "manueltSattSøknadMottattDato": "${SOKNAD_MOTTATT_DATO:-${tiltak_fra}}",
  "manueltSattSøknadsperiode": {"fraOgMed":"${tiltak_fra}","tilOgMed":"${tiltak_til}"},
  "manueltSattTiltak": null,
  "antallVedlegg": 0,
  "søknadstype": "${soknadstype}",
  "behandlingsarsak": null,
  "svar": {
    "tiltak": {
      "eksternDeltakelseId": "${ekstern_id}",
      "deltakelseFraOgMed": "${tiltak_fra}",
      "deltakelseTilOgMed": "${tiltak_til}",
      "tiltakskodeFraKilden": "${tiltakskode}",
      "typeNavn": "${tiltak_typenavn}"
    },
    "barnetilleggPdl": [],
    "barnetilleggManuelle": [],
    "harSøktPåTiltak": {"svar":"JA"},
    "harSøktOmBarnetillegg": {"svar":"NEI"},
    "kvp": {"svar":"NEI","periode":null},
    "intro": {"svar":"NEI","periode":null},
    "institusjon": {"svar":"NEI","periode":null},
    "etterlønn": {"svar":"NEI"},
    "gjenlevendepensjon": {"svar":"NEI","periode":null},
    "alderspensjon": {"svar":"NEI","fraOgMed":null},
    "sykepenger": {"svar":"NEI","periode":null},
    "supplerendeStønadAlder": {"svar":"NEI","periode":null},
    "supplerendeStønadFlyktning": {"svar":"NEI","periode":null},
    "jobbsjansen": {"svar":"NEI","periode":null},
    "trygdOgPensjon": {"svar":"NEI","periode":null}
  }
}
JSON
}

body="$(build_body "$ekstern_deltakelse_id")"
response="$(http_saksbehandler POST "/sak/${saksnummer}/soknad" "$body")"
behandling_id="$(jval "$response" "id")"
intern_deltakelse_id="$(jval "$response" "saksopplysninger.tiltaksdeltagelse[0].internDeltakelseId" 2>/dev/null || true)"
if [[ -z "$intern_deltakelse_id" && $MILJO != dev ]]; then
    log "Fant ikke internDeltakelseId for tilfeldig eksternDeltakelseId. Prøver med kjent fake-id."
    body="$(build_body "fa287e7-ddbb-44a2-9bfa-4da4661f8b6d")"
    response="$(http_saksbehandler POST "/sak/${saksnummer}/soknad" "$body")"
    behandling_id="$(jval "$response" "id")"
    intern_deltakelse_id="$(jval "$response" "saksopplysninger.tiltaksdeltagelse[0].internDeltakelseId" 2>/dev/null || true)"
fi

[[ -n "$behandling_id" ]] || fail "Mangler behandlingId i responsen."
[[ -n "$intern_deltakelse_id" ]] || fail "Mangler internDeltakelseId i responsen."
printf '%s %s\n' "$behandling_id" "$intern_deltakelse_id"
