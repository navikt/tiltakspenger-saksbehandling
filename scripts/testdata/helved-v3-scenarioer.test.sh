#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORK_DIR="${SCRIPT_DIR}/.helved-v3-test-work"
CALL_LOG="${WORK_DIR}/mutating-helpers-called"
VERIFISER_CALL_LOG="${WORK_DIR}/verifiser-helved-calls"
FAKE_CURL_BIN="${WORK_DIR}/fake-bin"
FAKE_HELVED_RESPONSES_DIR="${WORK_DIR}/helved-responses"
FAKE_HELVED_TOKEN="opaque-token-for-test"

if [[ -e "$WORK_DIR" ]]; then
    printf 'FEIL: Testområdet finnes allerede: %s\n' "$WORK_DIR" >&2
    exit 1
fi

mkdir "$WORK_DIR"
trap 'rm -rf -- "$WORK_DIR"' EXIT
mkdir "${WORK_DIR}/scripts"
mkdir "$FAKE_CURL_BIN" "$FAKE_HELVED_RESPONSES_DIR"
cp "${SCRIPT_DIR}/helved-v3-scenarioer.sh" "${WORK_DIR}/scripts/helved-v3-scenarioer.sh"

cat >"${WORK_DIR}/scripts/_lib.sh" <<'SH'
if [[ "${ASSERT_NO_LIB_SOURCE:-nei}" == "ja" ]]; then
    printf 'FEIL: _lib.sh ble sourced i verifiseringsmodus.\n' >&2
    exit 1
fi

log() {
    printf '%s\n' "$*" >&2
}

fail() {
    log "FEIL: $*"
    exit 1
}

require_server() {
    :
}

http_saksbehandler() {
    local method="$1"
    local path="${2:-}"

    if [[ "$method" == "PUT" ]]; then
        if [[ "${FAKE_CASE_CREATED:?Mangler opprettelsesstatus.}" == "missing" ]]; then
            printf '{"saksnummer":"000000000000"}'
        else
            printf '{"saksnummer":"000000000000","opprettet":%s}' "$FAKE_CASE_CREATED"
        fi
        return
    fi
    [[ "$method" == "GET" ]] || fail "Selvtesten prøvde et kall som ikke er GET eller PUT."
    if [[ "$path" =~ ^/sak/([0-9]+)/oppdragstilstand$ ]]; then
        local saksnummer="${BASH_REMATCH[1]}"
        if [[ -n "${CALL_LOG:-}" ]]; then
            printf 'GET_OPPDRAGSTILSTAND\t%s\t-\n' "$saksnummer" >>"$CALL_LOG"
        fi
        if [[ "${FAKE_OPPDRAGSTILSTAND_FAIL:-nei}" == "ja" ]]; then
            printf 'GET %s: simulert feil.\n' "$path" >&2
            return 1
        fi
        if [[ -n "${FAKE_OPPDRAGSTILSTAND_JSON:-}" ]]; then
            printf '%s' "$FAKE_OPPDRAGSTILSTAND_JSON"
        else
            printf '{"saksnummer":"%s","oppdragsversjon":"V3","oppdragsmigrering":null,"sperrerUtbetalinger":false,"migrertHosHelVedTidspunkt":null}' "$saksnummer"
        fi
        return
    fi
    if [[ -n "${FAKE_CASE_JSON_AFTER:-}" ]]; then
        if [[ -e "${FAKE_CASE_AFTER_MARKER:?Mangler testmarkør.}" ]]; then
            printf '%s' "$FAKE_CASE_JSON_AFTER"
        else
            : >"$FAKE_CASE_AFTER_MARKER"
            printf '%s' "${FAKE_CASE_JSON:?Mangler testtilstand.}"
        fi
        return
    fi
    printf '%s' "${FAKE_CASE_JSON:?Mangler testtilstand.}"
}

jval() {
    python3 - "$1" "$2" <<'PY'
import json
import sys

value = json.loads(sys.argv[1])[sys.argv[2]]
if isinstance(value, bool):
    print("true" if value else "false")
else:
    print(value)
PY
}

krev_syntetisk_fnr() {
    :
}
SH

cat >"${FAKE_CURL_BIN}/curl" <<'SH'
#!/usr/bin/env bash
set -euo pipefail

method="GET"
url=""
data=""
auth_header=""

while [[ $# -gt 0 ]]; do
    case "$1" in
    -s | -S | -sS | --fail-with-body)
        shift
        ;;
    -X)
        [[ $# -ge 2 ]] || {
            printf 'FEIL: Mangler verdi for -X.\n' >&2
            exit 97
        }
        method="$2"
        shift 2
        ;;
    -H)
        [[ $# -ge 2 ]] || {
            printf 'FEIL: Mangler verdi for -H.\n' >&2
            exit 97
        }
        if [[ "$2" == Authorization:\ Bearer\ * ]]; then
            auth_header="${2#Authorization: Bearer }"
        fi
        shift 2
        ;;
    -d | --data | --data-raw | --data-binary)
        [[ $# -ge 2 ]] || {
            printf 'FEIL: Mangler verdi for %s.\n' "$1" >&2
            exit 97
        }
        data="$2"
        shift 2
        ;;
    https://* | http://*)
        [[ -z "$url" ]] || {
            printf 'FEIL: Bare én URL er tillatt.\n' >&2
            exit 97
        }
        url="$1"
        shift
        ;;
    *)
        printf 'FEIL: Uventet curl-argument i teststub: %s\n' "$1" >&2
        exit 97
        ;;
    esac
done

[[ -n "$url" ]] || {
    printf 'FEIL: curl-teststub mangler URL.\n' >&2
    exit 97
}

if [[ -n "${CALL_LOG:-}" ]]; then
    printf '%s\t%s\t%s\n' "$method" "$url" "$data" >>"$CALL_LOG"
fi

TOKEN_URL="https://azure-token-generator.intern.dev.nav.no/api/public/m2m"
if [[ "$url" == "$TOKEN_URL" ]]; then
    [[ "$method" == "POST" ]] || {
        printf 'FEIL: Token-endepunktet støtter bare POST.\n' >&2
        exit 98
    }
    [[ "$data" == "aud=dev-gcp.helved.peisschtappern" ]] || {
        printf 'FEIL: Uventet token-payload.\n' >&2
        exit 98
    }
    [[ -z "$auth_header" ]] || {
        printf 'FEIL: Token-endepunktet skal ikke ha Authorization-header.\n' >&2
        exit 98
    }
    printf '%s' "${FAKE_HELVED_TOKEN:?Mangler testtoken.}"
    exit 0
fi

if [[ "$url" =~ ^https://peisschtappern\.intern\.dev\.nav\.no/api/saker/([0-9]+)/TILTPENG$ ]]; then
    saksnummer="${BASH_REMATCH[1]}"
    [[ "$method" == "GET" ]] || {
        printf 'FEIL: Peisschtappern-endepunktet støtter bare GET.\n' >&2
        exit 98
    }
    [[ -z "$data" ]] || {
        printf 'FEIL: GET-kall kan ikke ha body.\n' >&2
        exit 98
    }
    [[ "$auth_header" == "${FAKE_HELVED_TOKEN:?Mangler testtoken.}" ]] || {
        printf 'FEIL: Feil eller manglende bearer-token.\n' >&2
        exit 98
    }
    responsfil="${FAKE_HELVED_RESPONSES_DIR:?Mangler responsmappe.}/${saksnummer}.json"
    [[ -f "$responsfil" ]] || {
        printf 'FEIL: Mangler testrespons for sak %s.\n' "$saksnummer" >&2
        exit 22
    }
    cat "$responsfil"
    exit 0
fi

printf 'FEIL: Uventet URL i curl-teststub: %s\n' "$url" >&2
exit 99
SH
chmod +x "${FAKE_CURL_BIN}/curl"

cat >"${WORK_DIR}/scripts/mutating-helper" <<'SH'
#!/usr/bin/env bash
printf '%s\t%s\t%s\n' "${0##*/}" "$*" "${SOKNADSBEHANDLING_ID-}" >>"${CALL_LOG:?Mangler kall-logg.}"
printf 'SAK_ID=test-sak-id\nBEHANDLING_ID=test-behandling-id\n'
SH
chmod +x "${WORK_DIR}/scripts/mutating-helper"
for helper in \
    fullfor-soknadsbehandling.sh \
    send-soknad-dev.sh \
    registrer-papir-soknad.sh \
    hent-eller-opprett-sak.sh \
    fyll-og-iverksett-meldekort.sh \
    start-revurdering.sh \
    send-til-beslutning.sh \
    ta-behandling.sh \
    iverksett.sh; do
    cp "${WORK_DIR}/scripts/mutating-helper" "${WORK_DIR}/scripts/${helper}"
done
cp "${SCRIPT_DIR}/hent-eller-opprett-sak.sh" "${WORK_DIR}/scripts/hent-eller-opprett-sak.sh"
mkdir "${WORK_DIR}/pinned-scripts"
cp "${SCRIPT_DIR}/fullfor-soknadsbehandling.sh" "${WORK_DIR}/pinned-scripts/fullfor-soknadsbehandling.sh"
cp "${WORK_DIR}/scripts/_lib.sh" "${WORK_DIR}/pinned-scripts/_lib.sh"
for helper in oppdater-innvilgelse.sh send-til-beslutning.sh iverksett.sh; do
    cp "${WORK_DIR}/scripts/mutating-helper" "${WORK_DIR}/pinned-scripts/${helper}"
done

SAK_MED_TO_KJEDER="$(cat <<'JSON'
{
  "sakId": "test-sak-id",
  "rammebehandlinger": [{
    "id": "test-papirbehandling",
    "type": "SØKNADSBEHANDLING",
    "status": "VEDTATT",
    "opprettet": "2026-01-01T00:00:00",
    "søknad": {"søknadstype": "PAPIR_SKJEMA"}
  }],
  "åpneBehandlinger": [],
  "meldeperiodeKjeder": [
    {
      "id": "test-kjede-0",
      "åpenBehandlingId": null,
      "meldekortbehandlingIder": [],
      "periode": {"fraOgMed": "2026-01-01", "tilOgMed": "2026-01-14"},
      "sisteMeldeperiode": {"girRett": {"2026-01-05": true, "2026-01-06": true}}
    },
    {
      "id": "test-kjede-1",
      "åpenBehandlingId": null,
      "meldekortbehandlingIder": [],
      "periode": {"fraOgMed": "2026-01-15", "tilOgMed": "2026-01-28"},
      "sisteMeldeperiode": {"girRett": {"2026-01-19": true, "2026-01-20": true}}
    }
  ],
  "meldekortbehandlinger": {}
}
JSON
)"

SAK_MED_EN_KJEDE="$(cat <<'JSON'
{
  "sakId": "test-sak-id",
  "rammebehandlinger": [{
    "id": "test-papirbehandling",
    "type": "SØKNADSBEHANDLING",
    "status": "VEDTATT",
    "opprettet": "2026-01-01T00:00:00",
    "søknad": {"søknadstype": "PAPIR_SKJEMA"}
  }],
  "åpneBehandlinger": [],
  "meldeperiodeKjeder": [{
    "id": "test-kjede-0",
    "åpenBehandlingId": null,
    "meldekortbehandlingIder": [],
    "periode": {"fraOgMed": "2026-01-01", "tilOgMed": "2026-01-14"},
    "sisteMeldeperiode": {"girRett": {"2026-01-05": true, "2026-01-06": true}}
  }],
  "meldekortbehandlinger": {}
}
JSON
)"

med_nyere_digital_soknad() {
    python3 - "$1" "$2" <<'PY'
import json
import sys

sak = json.loads(sys.argv[1])
sak["rammebehandlinger"][0]["status"] = sys.argv[2]
sak["rammebehandlinger"].append({
    "id": "test-digitalbehandling",
    "type": "SØKNADSBEHANDLING",
    "status": "VEDTATT",
    "opprettet": "2026-02-01T00:00:00",
    "søknad": {"søknadstype": "DIGITAL"},
    "saksopplysninger": {
        "tiltaksdeltagelse": [{
            "internDeltakelseId": "test-digital-deltakelse",
            "periode": {"fraOgMed": "2026-01-01", "tilOgMed": "2026-01-28"}
        }]
    },
})
print(json.dumps(sak, ensure_ascii=False))
PY
}

SAK_DELVIS_PAPIR="$(python3 - "$SAK_MED_TO_KJEDER" <<'PY'
import json
import sys

sak = json.loads(sys.argv[1])
sak["rammebehandlinger"][0]["status"] = "UNDER_BEHANDLING"
sak["rammebehandlinger"][0]["saksopplysninger"] = {
    "tiltaksdeltagelse": [{
        "internDeltakelseId": "test-papir-deltakelse",
        "periode": {"fraOgMed": "2026-01-01", "tilOgMed": "2026-01-28"},
    }]
}
print(json.dumps(sak, ensure_ascii=False))
PY
)"
SAK_PAPIR_VEDTATT_MED_NYERE_DIGITAL="$(med_nyere_digital_soknad "$SAK_DELVIS_PAPIR" VEDTATT)"
SAK_DELVIS_PAPIR_MED_NYERE_VEDTATT_PAPIR="$(python3 - "$SAK_DELVIS_PAPIR" <<'PY'
import json
import sys

sak = json.loads(sys.argv[1])
sak["rammebehandlinger"].append({
    "id": "test-nyeste-papirbehandling",
    "type": "SØKNADSBEHANDLING",
    "status": "VEDTATT",
    "opprettet": "2026-02-01T00:00:00",
    "søknad": {"søknadstype": "PAPIR_SKJEMA"},
})
print(json.dumps(sak, ensure_ascii=False))
PY
)"

SAK_VEDTATT_MED_NYERE_DIGITAL="$(med_nyere_digital_soknad "$SAK_MED_TO_KJEDER" VEDTATT)"
SAK_DELVIS_MED_NYERE_DIGITAL="$(med_nyere_digital_soknad "$SAK_MED_TO_KJEDER" UNDER_BEHANDLING)"
SAK_MED_GODKJENT_MELDEKORT="$(python3 - "$SAK_MED_TO_KJEDER" <<'PY'
import json
import sys

sak = json.loads(sys.argv[1])
sak["meldeperiodeKjeder"][0]["meldekortbehandlingIder"] = ["test-godkjent"]
sak["meldekortbehandlinger"]["test-godkjent"] = {"status": "GODKJENT"}
print(json.dumps(sak, ensure_ascii=False))
PY
)"
SAK_MED_EN_KJEDE_MED_FNR="$(python3 - "$SAK_MED_EN_KJEDE" <<'PY'
import json
import sys

sak = json.loads(sys.argv[1])
sak["fnr.verdi"] = "12845678911"
print(json.dumps(sak, ensure_ascii=False))
PY
)"
OPPDRAGSTILSTAND_V3="$(cat <<'JSON'
{"saksnummer":"000000000000","oppdragsversjon":"V3","oppdragsmigrering":null,"sperrerUtbetalinger":false,"migrertHosHelVedTidspunkt":null}
JSON
)"
OPPDRAGSTILSTAND_V2="$(cat <<'JSON'
{"saksnummer":"000000000000","oppdragsversjon":"V2","oppdragsmigrering":null,"sperrerUtbetalinger":false,"migrertHosHelVedTidspunkt":null}
JSON
)"
OPPDRAGSTILSTAND_SPERRET="$(cat <<'JSON'
{"saksnummer":"000000000000","oppdragsversjon":"V3","oppdragsmigrering":"HEL_VED","sperrerUtbetalinger":true,"migrertHosHelVedTidspunkt":"2026-11-11T12:00:00Z"}
JSON
)"

feil() {
    printf 'FEIL: %s\n' "$*" >&2
    exit 1
}

muterende_helper_kall() {
    if [[ ! -s "$CALL_LOG" ]]; then
        return 0
    fi
    grep -v '^GET_OPPDRAGSTILSTAND\t' "$CALL_LOG" || true
}

assert_ingen_muterende_helper() {
    local feiltekst="$1"
    [[ -z "$(muterende_helper_kall)" ]] || feil "$feiltekst"
}

forvent_feil_uten_mutering() {
    local navn="$1"
    local tilstand="$2"
    local kommando="$3"
    local manifest="$4"
    local output

    : >"$CALL_LOG"
    if output="$(FAKE_CASE_JSON="$tilstand" CALL_LOG="$CALL_LOG" bash "${WORK_DIR}/scripts/helved-v3-scenarioer.sh" "$kommando" "$manifest" 2>"${WORK_DIR}/${navn}.stderr")"; then
        feil "${navn}: kommandoen skulle ha feilet."
    fi
    assert_ingen_muterende_helper "${navn}: en muterende hjelper ble kalt."
    return 0
}

skriv_helved_respons() {
    local saksnummer="$1"
    local innhold="$2"
    printf '%s' "$innhold" >"${FAKE_HELVED_RESPONSES_DIR}/${saksnummer}.json"
}

forbered_helved_verifisering() {
    rm -f "${FAKE_HELVED_RESPONSES_DIR}"/*.json
    : >"$VERIFISER_CALL_LOG"
}

kjor_verifiser_helved() {
    local manifest="$1"
    local stdout_fil="$2"
    local stderr_fil="$3"
    PATH="${FAKE_CURL_BIN}:${PATH}" \
        CALL_LOG="$VERIFISER_CALL_LOG" \
        FAKE_HELVED_TOKEN="$FAKE_HELVED_TOKEN" \
        FAKE_HELVED_RESPONSES_DIR="$FAKE_HELVED_RESPONSES_DIR" \
        ASSERT_NO_LIB_SOURCE=ja \
        bash "${WORK_DIR}/scripts/helved-v3-scenarioer.sh" verifiser-helved "$manifest" >"$stdout_fil" 2>"$stderr_fil"
}

output="$(FAKE_CASE_CREATED=true bash "${WORK_DIR}/scripts/hent-eller-opprett-sak.sh" 12845678911 V3)"
[[ "$output" == "000000000000" ]] || feil "Standardmodusen for hent-eller-opprett-sak.sh endret format."
output="$(FAKE_CASE_CREATED=false bash "${WORK_DIR}/scripts/hent-eller-opprett-sak.sh" 12845678911 V2 --med-opprettelse)"
[[ "$output" == $'SAKSNUMMER=000000000000\nOPPRETTET=false' ]] || feil "Detaljmodus returnerte ikke nøyaktig saksnummer og opprettelsesstatus."
if FAKE_CASE_CREATED=missing bash "${WORK_DIR}/scripts/hent-eller-opprett-sak.sh" 12845678911 --med-opprettelse >/dev/null 2>"${WORK_DIR}/missing-created.stderr"; then
    feil "Detaljmodus godtok en respons uten opprettelsesstatus."
fi

if output="$(FAKE_CASE_CREATED=false CALL_LOG="$CALL_LOG" bash "${WORK_DIR}/scripts/helved-v3-scenarioer.sh" forbered-papir 12845678911 V3 2>"${WORK_DIR}/existing-case.stderr")"; then
    feil "forbered-papir skulle ha avvist en eksisterende sak."
fi
[[ -z "$output" ]] || feil "forbered-papir skrev ut et resultat for en eksisterende sak."
grep -q "kan ikke verifiseres fra GET /sak" "${WORK_DIR}/existing-case.stderr" || feil "Avvisningen forklarte ikke versjonsusikkerheten for en eksisterende sak."
assert_ingen_muterende_helper "forbered-papir registrerte en papirsøknad på en eksisterende sak."

: >"$CALL_LOG"
output="$(FAKE_CASE_CREATED=true FAKE_CASE_JSON="$SAK_MED_TO_KJEDER" CALL_LOG="$CALL_LOG" bash "${WORK_DIR}/scripts/helved-v3-scenarioer.sh" forbered-papir 12845678911 V3)"
[[ "$output" == *"OPPDRAGSVERSJON=V3"* ]] || feil "forbered-papir skrev ikke ut den eksplisitte oppdragsversjonen."
grep -q '^registrer-papir-soknad.sh' "$CALL_LOG" || feil "En ny sak fikk ikke registrert papirsøknaden."
grep -q '^fullfor-soknadsbehandling.sh' "$CALL_LOG" || feil "En ny sak ble ikke ført fram til vedtak."

cat >"${WORK_DIR}/malformed.tsv" <<'TSV'
SAKSNUMMER	VERSJON	OPPDRAG_BEREGNET	SIMULERING_OK
not-a-case	V3	ja	ja
TSV
forvent_feil_uten_mutering malformed "$SAK_MED_TO_KJEDER" utbetaling "${WORK_DIR}/malformed.tsv"

cat >"${WORK_DIR}/missing-confirmations.tsv" <<'TSV'
SAKSNUMMER	VERSJON	OPPDRAG_BEREGNET	SIMULERING_OK
000000000000	V3	nei	nei
TSV
: >"$CALL_LOG"
if output="$(FAKE_CASE_JSON="$SAK_MED_TO_KJEDER" CALL_LOG="$CALL_LOG" bash "${WORK_DIR}/scripts/helved-v3-scenarioer.sh" utbetaling "${WORK_DIR}/missing-confirmations.tsv" 2>"${WORK_DIR}/missing-confirmations.stderr")"; then
    feil "Manglende ja-bekreftelser skulle blokkere utbetaling."
fi
[[ "$output" == *"OPPDRAG_BEREGNET"* && "$output" == *"SIMULERING_OK"* ]] || feil "Manglende ja-bekreftelser ble ikke forklart."
assert_ingen_muterende_helper "Manglende ja-bekreftelser kalte en muterende hjelper."

cat >"${WORK_DIR}/oppdragstilstand-klar.tsv" <<'TSV'
000000000000	V3	ja	ja
TSV
: >"$CALL_LOG"
output="$(FAKE_CASE_JSON="$SAK_MED_TO_KJEDER" FAKE_OPPDRAGSTILSTAND_JSON="$OPPDRAGSTILSTAND_V3" CALL_LOG="$CALL_LOG" bash "${WORK_DIR}/scripts/helved-v3-scenarioer.sh" simuler-gate "${WORK_DIR}/oppdragstilstand-klar.tsv" 2>"${WORK_DIR}/oppdragstilstand-klar.stderr")"
[[ "$output" == $'000000000000\tKLAR' ]] || feil "V3-sak med åpen oppdragstilstand ble ikke rapportert som KLAR."
assert_ingen_muterende_helper "simuler-gate kalte en muterende hjelper i V3-klarscenarioet."

cat >"${WORK_DIR}/oppdragstilstand-v2.tsv" <<'TSV'
000000000000	V3	ja	ja
TSV
: >"$CALL_LOG"
if output="$(FAKE_CASE_JSON="$SAK_MED_TO_KJEDER" FAKE_OPPDRAGSTILSTAND_JSON="$OPPDRAGSTILSTAND_V2" CALL_LOG="$CALL_LOG" bash "${WORK_DIR}/scripts/helved-v3-scenarioer.sh" utbetaling "${WORK_DIR}/oppdragstilstand-v2.tsv" 2>"${WORK_DIR}/oppdragstilstand-v2.stderr")"; then
    feil "V3-manifest med oppdragstilstand V2 skulle blokkeres."
fi
[[ "$output" == *"oppdragsversjon er ikke V3"* ]] || feil "V2 i oppdragstilstanden ble ikke forklart."
assert_ingen_muterende_helper "V2 i oppdragstilstanden kalte en muterende hjelper."

cat >"${WORK_DIR}/oppdragstilstand-sperret.tsv" <<'TSV'
000000000000	V3	ja	ja
TSV
: >"$CALL_LOG"
if output="$(FAKE_CASE_JSON="$SAK_MED_TO_KJEDER" FAKE_OPPDRAGSTILSTAND_JSON="$OPPDRAGSTILSTAND_SPERRET" CALL_LOG="$CALL_LOG" bash "${WORK_DIR}/scripts/helved-v3-scenarioer.sh" utbetaling "${WORK_DIR}/oppdragstilstand-sperret.tsv" 2>"${WORK_DIR}/oppdragstilstand-sperret.stderr")"; then
    feil "Sperret oppdragstilstand skulle blokkere utbetaling."
fi
[[ "$output" == *"sperrer utbetalinger"* ]] || feil "Sperret oppdragstilstand ble ikke forklart."
assert_ingen_muterende_helper "Sperret oppdragstilstand kalte en muterende hjelper."

cat >"${WORK_DIR}/oppdragstilstand-utilgjengelig.tsv" <<'TSV'
000000000000	V3	ja	ja
TSV
: >"$CALL_LOG"
if output="$(FAKE_CASE_JSON="$SAK_MED_TO_KJEDER" FAKE_OPPDRAGSTILSTAND_FAIL=ja CALL_LOG="$CALL_LOG" bash "${WORK_DIR}/scripts/helved-v3-scenarioer.sh" utbetaling "${WORK_DIR}/oppdragstilstand-utilgjengelig.tsv" 2>"${WORK_DIR}/oppdragstilstand-utilgjengelig.stderr")"; then
    feil "Utilgjengelig oppdragstilstand skulle blokkere utbetaling."
fi
[[ "$output" == *"Oppdragstilstanden kunne ikke leses"* ]] || feil "Utilgjengelig oppdragstilstand ble ikke forklart."
[[ "$output" != *$'\tGJENNOMFØRT'* ]] || feil "Utilgjengelig oppdragstilstand ga delvis muteringsresultat."
assert_ingen_muterende_helper "Utilgjengelig oppdragstilstand kalte en muterende hjelper."

cat >"${WORK_DIR}/oppdragstilstand-malformet.tsv" <<'TSV'
000000000000	V3	ja	ja
TSV
: >"$CALL_LOG"
if output="$(FAKE_CASE_JSON="$SAK_MED_TO_KJEDER" FAKE_OPPDRAGSTILSTAND_JSON='{"saksnummer":"000000000000","oppdragsversjon":"V3"' CALL_LOG="$CALL_LOG" bash "${WORK_DIR}/scripts/helved-v3-scenarioer.sh" utbetaling "${WORK_DIR}/oppdragstilstand-malformet.tsv" 2>"${WORK_DIR}/oppdragstilstand-malformet.stderr")"; then
    feil "Malformet oppdragstilstand skulle blokkere utbetaling."
fi
[[ "$output" == *"Oppdragstilstanden kunne ikke leses"* ]] || feil "Malformet oppdragstilstand ble ikke forklart."
assert_ingen_muterende_helper "Malformet oppdragstilstand kalte en muterende hjelper."

cat >"${WORK_DIR}/v2-case.tsv" <<'TSV'
000000000000	V2	ja	ja
TSV
: >"$CALL_LOG"
if output="$(FAKE_CASE_JSON="$SAK_MED_TO_KJEDER" CALL_LOG="$CALL_LOG" bash "${WORK_DIR}/scripts/helved-v3-scenarioer.sh" utbetaling "${WORK_DIR}/v2-case.tsv" 2>"${WORK_DIR}/v2-case.stderr")"; then
    feil "V2-sak skulle blokkere V3-utbetaling."
fi
[[ "$output" == *"VERSJON må være V3"* ]] || feil "V2-sak ble ikke forklart."
assert_ingen_muterende_helper "V2-sak kalte en muterende hjelper."

cat >"${WORK_DIR}/validate-all-first.tsv" <<'TSV'
000000000000	V3	ja	ja
000000000001	V2	ja	ja
TSV
: >"$CALL_LOG"
if output="$(FAKE_CASE_JSON="$SAK_MED_TO_KJEDER" CALL_LOG="$CALL_LOG" bash "${WORK_DIR}/scripts/helved-v3-scenarioer.sh" utbetaling "${WORK_DIR}/validate-all-first.tsv" 2>"${WORK_DIR}/validate-all-first.stderr")"; then
    feil "utbetaling skulle ha validert alle manifestradene før mutering."
fi
[[ "$output" == *"VERSJON må være V3"* ]] || feil "Blokkeringen i den siste manifestraden ble ikke vist."
[[ "$(grep -c '^GET_OPPDRAGSTILSTAND\t' "$CALL_LOG")" -eq 2 ]] || feil "utbetaling leste ikke oppdragstilstanden for alle manifestradene."
assert_ingen_muterende_helper "utbetaling muterte en tidligere manifestrad før hele manifestet var validert."

cat >"${WORK_DIR}/too-few-chains.tsv" <<'TSV'
000000000000	V3	ja	ja
TSV
: >"$CALL_LOG"
if output="$(FAKE_CASE_JSON="$SAK_MED_EN_KJEDE" CALL_LOG="$CALL_LOG" bash "${WORK_DIR}/scripts/helved-v3-scenarioer.sh" utbetaling "${WORK_DIR}/too-few-chains.tsv" 2>"${WORK_DIR}/too-few-chains.stderr")"; then
    feil "For få kjeder skulle blokkere utbetaling."
fi
[[ "$output" == *"minst to meldeperiodekjeder"* ]] || feil "For få kjeder ble ikke forklart."
assert_ingen_muterende_helper "For få kjeder kalte en muterende hjelper."

cat >"${WORK_DIR}/replay.tsv" <<'TSV'
000000000000	V3	ja	ja
TSV
: >"$CALL_LOG"
output="$(FAKE_CASE_JSON="$SAK_MED_GODKJENT_MELDEKORT" CALL_LOG="$CALL_LOG" bash "${WORK_DIR}/scripts/helved-v3-scenarioer.sh" simuler-gate "${WORK_DIR}/replay.tsv" 2>"${WORK_DIR}/replay-gate.stderr")"
[[ "$output" == $'000000000000\tKLAR' ]] || feil "simuler-gate avviste en sak med tidligere meldekortbehandling."
: >"$CALL_LOG"
if output="$(FAKE_CASE_JSON="$SAK_MED_GODKJENT_MELDEKORT" CALL_LOG="$CALL_LOG" bash "${WORK_DIR}/scripts/helved-v3-scenarioer.sh" utbetaling "${WORK_DIR}/replay.tsv" 2>"${WORK_DIR}/replay.stderr")"; then
    feil "utbetaling godtok en sak med tidligere meldekortbehandling."
fi
[[ "$output" == *"urørte kjeder"* ]] || feil "Replay-gaten forklarte ikke at utbetaling krever urørte kjeder."
assert_ingen_muterende_helper "Replay-gaten kalte en muterende hjelper."

cat >"${WORK_DIR}/newer-digital.tsv" <<'TSV'
SAKSNUMMER
000000000000
TSV
: >"$CALL_LOG"
if output="$(FAKE_CASE_JSON="$SAK_DELVIS_MED_NYERE_DIGITAL" CALL_LOG="$CALL_LOG" bash "${WORK_DIR}/scripts/helved-v3-scenarioer.sh" fullfor "${WORK_DIR}/newer-digital.tsv" 2>"${WORK_DIR}/newer-digital.stderr")"; then
    feil "fullfor avanserte en papirsøknad foran en nyere digital søknad."
fi
grep -q "ikke er sakens nyeste søknadsbehandling" "${WORK_DIR}/newer-digital.stderr" || feil "Blokkeringen av nyere digital søknad ble ikke forklart."
assert_ingen_muterende_helper "fullfor kalte en muterende hjelper for en papirsøknad som ikke var nyest."

cat >"${WORK_DIR}/partial-paper.tsv" <<'TSV'
SAKSNUMMER
000000000000
TSV
: >"$CALL_LOG"
output="$(FAKE_CASE_JSON="$SAK_DELVIS_PAPIR" FAKE_CASE_JSON_AFTER="$SAK_PAPIR_VEDTATT_MED_NYERE_DIGITAL" FAKE_CASE_AFTER_MARKER="${WORK_DIR}/partial-paper.after" CALL_LOG="$CALL_LOG" bash "${WORK_DIR}/scripts/helved-v3-scenarioer.sh" fullfor "${WORK_DIR}/partial-paper.tsv" 2>"${WORK_DIR}/partial-paper.stderr")"
[[ "$output" == $'000000000000\tVEDTATT' ]] || feil "En delvis aktiv papirsøknad ble ikke ført til VEDTATT."
[[ "$(cat "$CALL_LOG")" == $'fullfor-soknadsbehandling.sh\t000000000000\ttest-papirbehandling' ]] || feil "fullfor sendte ikke id-en til papirsøknadsbehandlingen til fullfor-soknadsbehandling.sh."

: >"$CALL_LOG"
if output="$(FAKE_CASE_JSON="$SAK_DELVIS_PAPIR" FAKE_CASE_JSON_AFTER="$SAK_DELVIS_PAPIR_MED_NYERE_VEDTATT_PAPIR" FAKE_CASE_AFTER_MARKER="${WORK_DIR}/pinned-status.after" CALL_LOG="$CALL_LOG" bash "${WORK_DIR}/scripts/helved-v3-scenarioer.sh" fullfor "${WORK_DIR}/partial-paper.tsv" 2>"${WORK_DIR}/pinned-status.stderr")"; then
    feil "fullfor godtok en vedtatt nyere papirsøknad mens den festede behandlingen fortsatt var delvis aktiv."
fi
grep -q "papirsøknadsbehandling test-papirbehandling" "${WORK_DIR}/pinned-status.stderr" || feil "fullfor kontrollerte ikke statusen til den festede papirsøknadsbehandlingen."

cat >"${WORK_DIR}/already-vedtatt.tsv" <<'TSV'
SAKSNUMMER
000000000000
TSV
: >"$CALL_LOG"
output="$(FAKE_CASE_JSON="$SAK_MED_TO_KJEDER" CALL_LOG="$CALL_LOG" bash "${WORK_DIR}/scripts/helved-v3-scenarioer.sh" fullfor "${WORK_DIR}/already-vedtatt.tsv" 2>"${WORK_DIR}/already-vedtatt.stderr")"
[[ "$output" == $'000000000000\tVEDTATT' ]] || feil "En allerede vedtatt papirsøknad ble ikke gjenkjent."
assert_ingen_muterende_helper "En allerede vedtatt papirsøknad kalte en muterende hjelper."

output="$(FAKE_CASE_JSON="$SAK_VEDTATT_MED_NYERE_DIGITAL" CALL_LOG="$CALL_LOG" bash "${WORK_DIR}/scripts/helved-v3-scenarioer.sh" fullfor "${WORK_DIR}/already-vedtatt.tsv" 2>"${WORK_DIR}/already-vedtatt-newer-digital.stderr")"
[[ "$output" == $'000000000000\tVEDTATT' ]] || feil "En vedtatt papirsøknad ble blokkert av en nyere digital søknad."
assert_ingen_muterende_helper "En vedtatt papirsøknad med nyere digital søknad kalte en muterende hjelper."

: >"$CALL_LOG"
output="$(SOKNADSBEHANDLING_ID=test-papirbehandling FAKE_CASE_JSON="$SAK_DELVIS_PAPIR" FAKE_CASE_JSON_AFTER="$SAK_PAPIR_VEDTATT_MED_NYERE_DIGITAL" FAKE_CASE_AFTER_MARKER="${WORK_DIR}/pinned-helper.after" CALL_LOG="$CALL_LOG" bash "${WORK_DIR}/pinned-scripts/fullfor-soknadsbehandling.sh" 000000000000 2026-01-01 2026-01-28 2>"${WORK_DIR}/pinned-helper.stderr")"
[[ "$output" == $'SAKSNUMMER=000000000000\nSAK_ID=test-sak-id\nBEHANDLING_ID=test-papirbehandling' ]] || feil "fullfor-soknadsbehandling.sh byttet fra den festede papirsøknaden da en nyere digital søknad dukket opp."
grep -q '^oppdater-innvilgelse.sh' "$CALL_LOG" || feil "Den festede papirsøknaden ble ikke oppdatert."
grep -q '^send-til-beslutning.sh' "$CALL_LOG" || feil "Den festede papirsøknaden ble ikke sendt til beslutning."

: >"$CALL_LOG"
if output="$(SOKNADSBEHANDLING_ID=mangler FAKE_CASE_JSON="$SAK_DELVIS_PAPIR" CALL_LOG="$CALL_LOG" bash "${WORK_DIR}/pinned-scripts/fullfor-soknadsbehandling.sh" 000000000000 2>"${WORK_DIR}/missing-pinned-id.stderr")"; then
    feil "fullfor-soknadsbehandling.sh godtok en manglende festet behandling."
fi
grep -q "finnes ikke på saken" "${WORK_DIR}/missing-pinned-id.stderr" || feil "En manglende festet behandling ble ikke forklart."
assert_ingen_muterende_helper "En manglende festet behandling kalte en muterende hjelper."

SAK_MED_FEIL_BEHANDLINGSTYPE="$(python3 - "$SAK_DELVIS_PAPIR" <<'PY'
import json
import sys

sak = json.loads(sys.argv[1])
sak["rammebehandlinger"][0]["type"] = "MELDEKORTBEHANDLING"
print(json.dumps(sak, ensure_ascii=False))
PY
)"
: >"$CALL_LOG"
if output="$(SOKNADSBEHANDLING_ID=test-papirbehandling FAKE_CASE_JSON="$SAK_MED_FEIL_BEHANDLINGSTYPE" CALL_LOG="$CALL_LOG" bash "${WORK_DIR}/pinned-scripts/fullfor-soknadsbehandling.sh" 000000000000 2>"${WORK_DIR}/wrong-pinned-type.stderr")"; then
    feil "fullfor-soknadsbehandling.sh godtok en festet behandling som ikke er en søknadsbehandling."
fi
grep -q "ikke en SØKNADSBEHANDLING" "${WORK_DIR}/wrong-pinned-type.stderr" || feil "En festet behandling med feil type ble ikke forklart."
assert_ingen_muterende_helper "En festet behandling med feil type kalte en muterende hjelper."

: >"$CALL_LOG"
if FAKE_CASE_JSON="$SAK_MED_EN_KJEDE_MED_FNR" FAKE_OPPDRAGSTILSTAND_JSON="$OPPDRAGSTILSTAND_V3" CALL_LOG="$CALL_LOG" bash "${WORK_DIR}/scripts/helved-v3-scenarioer.sh" 000000000000 2>"${WORK_DIR}/legacy-order.stderr"; then
    feil "Legacy-kjøring med én kjede skulle stoppe før steg 3."
fi
first_call="$(head -n 1 "$CALL_LOG" || true)"
[[ "$first_call" == $'GET_OPPDRAGSTILSTAND\t000000000000\t-' ]] || feil "Legacy-kjøringen leste ikke oppdragstilstand før første muterende steg."
grep -q '^fullfor-soknadsbehandling.sh' "$CALL_LOG" || feil "Legacy-kjøringen nådde aldri første muterende steg."

: >"$CALL_LOG"
output="$(env -u SOKNADSBEHANDLING_ID FAKE_CASE_JSON="$SAK_VEDTATT_MED_NYERE_DIGITAL" CALL_LOG="$CALL_LOG" bash "${WORK_DIR}/pinned-scripts/fullfor-soknadsbehandling.sh" 000000000000 2026-01-01 2026-01-28 2>"${WORK_DIR}/legacy-selection.stderr")"
[[ "$output" == $'SAKSNUMMER=000000000000\nSAK_ID=test-sak-id\nBEHANDLING_ID=test-digitalbehandling' ]] || feil "fullfor-soknadsbehandling.sh beholdt ikke legacy-valget av nyeste søknadsbehandling."

forbered_helved_verifisering
if PATH="${FAKE_CURL_BIN}:${PATH}" CALL_LOG="$VERIFISER_CALL_LOG" FAKE_HELVED_TOKEN="$FAKE_HELVED_TOKEN" FAKE_HELVED_RESPONSES_DIR="$FAKE_HELVED_RESPONSES_DIR" curl -sS --fail-with-body https://example.com >/dev/null 2>&1; then
    feil "curl-teststub godtok en URL utenfor kontrakten."
fi
if PATH="${FAKE_CURL_BIN}:${PATH}" CALL_LOG="$VERIFISER_CALL_LOG" FAKE_HELVED_TOKEN="$FAKE_HELVED_TOKEN" FAKE_HELVED_RESPONSES_DIR="$FAKE_HELVED_RESPONSES_DIR" curl -sS --fail-with-body -X POST "https://peisschtappern.intern.dev.nav.no/api/saker/202611201001/TILTPENG" >/dev/null 2>&1; then
    feil "curl-teststub godtok feil metode mot Peisschtappern-endepunktet."
fi

cat >"${WORK_DIR}/helved-malformed.tsv" <<'TSV'
SAKSNUMMER	FORVENTET_OK
202611201001
TSV
forbered_helved_verifisering
if kjor_verifiser_helved "${WORK_DIR}/helved-malformed.tsv" "${WORK_DIR}/helved-malformed.stdout" "${WORK_DIR}/helved-malformed.stderr"; then
    feil "verifiser-helved godtok et feilformatert manifest."
fi
[[ ! -s "$VERIFISER_CALL_LOG" ]] || feil "Feilformatert manifest trigget token- eller sakskall."

cat >"${WORK_DIR}/helved-duplicate.tsv" <<'TSV'
SAKSNUMMER	FORVENTET_OK
202611201001	1
202611201001	2
TSV
forbered_helved_verifisering
if kjor_verifiser_helved "${WORK_DIR}/helved-duplicate.tsv" "${WORK_DIR}/helved-duplicate.stdout" "${WORK_DIR}/helved-duplicate.stderr"; then
    feil "verifiser-helved godtok dupliserte saksnumre."
fi
[[ ! -s "$VERIFISER_CALL_LOG" ]] || feil "Duplikatmanifest trigget token- eller sakskall."

cat >"${WORK_DIR}/helved-ok.tsv" <<'TSV'
SAKSNUMMER	FORVENTET_OK
202611201001	1
TSV
forbered_helved_verifisering
skriv_helved_respons "202611201001" '[
  {"topic_name":"helved.oppdrag.v1","key":"rekord-1","status":null,"system_time_ms":100,"trace_id":"trace-100"},
  {"topic_name":"helved.oppdrag.v1","key":"rekord-1","status":"OK","system_time_ms":200,"trace_id":"trace-200"}
]'
if ! kjor_verifiser_helved "${WORK_DIR}/helved-ok.tsv" "${WORK_DIR}/helved-ok.stdout" "${WORK_DIR}/helved-ok.stderr"; then
    feil "verifiser-helved skulle gitt OK for null-til-OK-sekvens."
fi
grep -q $'^202611201001\t1\t1\t0\t0\tOK\t$' "${WORK_DIR}/helved-ok.stdout" || feil "verifiser-helved skrev ikke forventet OK-rad."
[[ "$(grep -c $'^POST\thttps://azure-token-generator.intern.dev.nav.no/api/public/m2m\taud=dev-gcp.helved.peisschtappern$' "$VERIFISER_CALL_LOG")" -eq 1 ]] || feil "verifiser-helved kalte ikke token-endepunktet nøyaktig én gang."
[[ "$(grep -c $'^GET\thttps://peisschtappern.intern.dev.nav.no/api/saker/202611201001/TILTPENG\t$' "$VERIFISER_CALL_LOG")" -eq 1 ]] || feil "verifiser-helved kalte ikke Peisschtappern nøyaktig én gang for saken."
if grep -q "$FAKE_HELVED_TOKEN" "${WORK_DIR}/helved-ok.stdout" "${WORK_DIR}/helved-ok.stderr" "$VERIFISER_CALL_LOG"; then
    feil "verifiser-helved lekket testtoken i output eller kall-logg."
fi

cat >"${WORK_DIR}/helved-feilet.tsv" <<'TSV'
SAKSNUMMER	FORVENTET_OK
202611201002	1
TSV
forbered_helved_verifisering
skriv_helved_respons "202611201002" '[
  {"topic_name":"helved.oppdrag.v1","key":"rekord-2","status":"FEILET","system_time_ms":200,"trace_id":"trace-202"},
  {"topic_name":"helved.oppdrag.v1","key":"rekord-2","status":"OK","system_time_ms":100,"trace_id":"trace-201"}
]'
if kjor_verifiser_helved "${WORK_DIR}/helved-feilet.tsv" "${WORK_DIR}/helved-feilet.stdout" "${WORK_DIR}/helved-feilet.stderr"; then
    feil "verifiser-helved skulle returnert FEIL når nyeste status er FEILET selv om eldre OK står sist i JSON-listen."
fi
grep -q $'^202611201002\t1\t0\t1\t0\tFEIL\tkey=rekord-2,status=FEILET,trace_id=trace-202$' "${WORK_DIR}/helved-feilet.stdout" || feil "verifiser-helved klassifiserte ikke etter høyeste system_time_ms for FEILET-saken."

cat >"${WORK_DIR}/helved-no-events.tsv" <<'TSV'
SAKSNUMMER	FORVENTET_OK
202611201003	1
TSV
forbered_helved_verifisering
skriv_helved_respons "202611201003" '[]'
if kjor_verifiser_helved "${WORK_DIR}/helved-no-events.tsv" "${WORK_DIR}/helved-no-events.stdout" "${WORK_DIR}/helved-no-events.stderr"; then
    feil "verifiser-helved skulle gitt VENTER når saken mangler hendelser."
fi
grep -q $'^202611201003\t1\t0\t0\t0\tVENTER\t' "${WORK_DIR}/helved-no-events.stdout" || feil "Sak uten hendelser fikk ikke VENTER."

cat >"${WORK_DIR}/helved-pending.tsv" <<'TSV'
SAKSNUMMER	FORVENTET_OK
202611201004	1
TSV
forbered_helved_verifisering
skriv_helved_respons "202611201004" '[
  {"topic_name":"helved.oppdrag.v1","key":"rekord-4","status":"HOS_OPPDRAG","system_time_ms":300,"trace_id":"trace-300"}
]'
if kjor_verifiser_helved "${WORK_DIR}/helved-pending.tsv" "${WORK_DIR}/helved-pending.stdout" "${WORK_DIR}/helved-pending.stderr"; then
    feil "verifiser-helved skulle gitt VENTER for HOS_OPPDRAG."
fi
grep -q $'^202611201004\t1\t0\t0\t1\tVENTER\t' "${WORK_DIR}/helved-pending.stdout" || feil "HOS_OPPDRAG ble ikke klassifisert som VENTER."

cat >"${WORK_DIR}/helved-extra-ok.tsv" <<'TSV'
SAKSNUMMER	FORVENTET_OK
202611201005	1
TSV
forbered_helved_verifisering
skriv_helved_respons "202611201005" '[
  {"topic_name":"helved.oppdrag.v1","key":"rekord-a","status":"OK","system_time_ms":400,"trace_id":"trace-400"},
  {"topic_name":"helved.oppdrag.v1","key":"rekord-b","status":"OK","system_time_ms":500,"trace_id":"trace-500"}
]'
if kjor_verifiser_helved "${WORK_DIR}/helved-extra-ok.tsv" "${WORK_DIR}/helved-extra-ok.stdout" "${WORK_DIR}/helved-extra-ok.stderr"; then
    feil "verifiser-helved skulle gitt VENTER når antall unike nøkler overstiger forventningen."
fi
grep -q $'^202611201005\t1\t2\t0\t0\tVENTER\t' "${WORK_DIR}/helved-extra-ok.stdout" || feil "Sak med for mange OK-nøkler fikk ikke VENTER."

cat >"${WORK_DIR}/helved-malformed-json.tsv" <<'TSV'
SAKSNUMMER	FORVENTET_OK
202611201006	1
TSV
forbered_helved_verifisering
skriv_helved_respons "202611201006" '{"topic_name":"helved.oppdrag.v1","value":"SKAL_IKKE_LEKKE"'
if kjor_verifiser_helved "${WORK_DIR}/helved-malformed-json.tsv" "${WORK_DIR}/helved-malformed-json.stdout" "${WORK_DIR}/helved-malformed-json.stderr"; then
    feil "verifiser-helved skulle feile på ugyldig JSON."
fi
grep -q $'^202611201006\t1\t0\t0\t0\tFEIL\tSvar fra Peisschtappern er ikke gyldig JSON\.$' "${WORK_DIR}/helved-malformed-json.stdout" || feil "Ugyldig JSON ble ikke rapportert som FEIL."
if grep -q "SKAL_IKKE_LEKKE" "${WORK_DIR}/helved-malformed-json.stdout" "${WORK_DIR}/helved-malformed-json.stderr"; then
    feil "verifiser-helved lekket rå payload fra ugyldig JSON."
fi

cat >"${WORK_DIR}/helved-unknown-status.tsv" <<'TSV'
SAKSNUMMER	FORVENTET_OK
202611201007	1
TSV
forbered_helved_verifisering
skriv_helved_respons "202611201007" '[
  {"topic_name":"helved.oppdrag.v1","key":"rekord-7","status":"UKJENT_STATUS","system_time_ms":700,"trace_id":"trace-700","value":"HEMMELIG_VERDI"}
]'
if kjor_verifiser_helved "${WORK_DIR}/helved-unknown-status.tsv" "${WORK_DIR}/helved-unknown-status.stdout" "${WORK_DIR}/helved-unknown-status.stderr"; then
    feil "verifiser-helved skulle feile på ukjent status."
fi
grep -q $'^202611201007\t1\t0\t0\t0\tFEIL\t' "${WORK_DIR}/helved-unknown-status.stdout" || feil "Ukjent status ga ikke FEIL-rad."
if grep -q "HEMMELIG_VERDI" "${WORK_DIR}/helved-unknown-status.stdout" "${WORK_DIR}/helved-unknown-status.stderr"; then
    feil "verifiser-helved lekket felt som ikke skal vises i detaljene."
fi
if grep -q "$FAKE_HELVED_TOKEN" "${WORK_DIR}/helved-unknown-status.stdout" "${WORK_DIR}/helved-unknown-status.stderr" "$VERIFISER_CALL_LOG"; then
    feil "verifiser-helved lekket testtoken i ukjent-status-scenarioet."
fi

printf 'Selvtesten bestått.\n'
