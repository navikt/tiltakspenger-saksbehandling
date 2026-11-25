#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORK_DIR="${SCRIPT_DIR}/.helved-v3-test-work"
CALL_LOG="${WORK_DIR}/mutating-helpers-called"

if [[ -e "$WORK_DIR" ]]; then
    printf 'FEIL: Testområdet finnes allerede: %s\n' "$WORK_DIR" >&2
    exit 1
fi

mkdir "$WORK_DIR"
trap 'rm -rf -- "$WORK_DIR"' EXIT
mkdir "${WORK_DIR}/scripts"
cp "${SCRIPT_DIR}/helved-v3-scenarioer.sh" "${WORK_DIR}/scripts/helved-v3-scenarioer.sh"

cat >"${WORK_DIR}/scripts/_lib.sh" <<'SH'
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
    if [[ "$1" == "PUT" ]]; then
        if [[ "${FAKE_CASE_CREATED:?Mangler opprettelsesstatus.}" == "missing" ]]; then
            printf '{"saksnummer":"000000000000"}'
        else
            printf '{"saksnummer":"000000000000","opprettet":%s}' "$FAKE_CASE_CREATED"
        fi
        return
    fi
    [[ "$1" == "GET" ]] || fail "Selvtesten prøvde et kall som ikke er GET eller PUT."
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

cat >"${WORK_DIR}/scripts/mutating-helper" <<'SH'
#!/usr/bin/env bash
printf '%s\t%s\n' "${0##*/}" "$*" >>"${CALL_LOG:?Mangler kallogg.}"
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
})
print(json.dumps(sak, ensure_ascii=False))
PY
}

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

feil() {
    printf 'FEIL: %s\n' "$*" >&2
    exit 1
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
    [[ ! -s "$CALL_LOG" ]] || feil "${navn}: en muterende hjelper ble kalt."
    return 0
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
[[ ! -s "$CALL_LOG" ]] || feil "forbered-papir registrerte en papirsøknad på en eksisterende sak."

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
if output="$(FAKE_CASE_JSON="$SAK_MED_TO_KJEDER" CALL_LOG="$CALL_LOG" bash "${WORK_DIR}/scripts/helved-v3-scenarioer.sh" utbetaling "${WORK_DIR}/missing-confirmations.tsv" 2>"${WORK_DIR}/missing-confirmations.stderr")"; then
    feil "Manglende ja-bekreftelser skulle blokkere utbetaling."
fi
[[ "$output" == *"OPPDRAG_BEREGNET"* && "$output" == *"SIMULERING_OK"* ]] || feil "Manglende ja-bekreftelser ble ikke forklart."
[[ ! -s "$CALL_LOG" ]] || feil "Manglende ja-bekreftelser kalte en muterende hjelper."

cat >"${WORK_DIR}/v2-case.tsv" <<'TSV'
000000000000	V2	ja	ja
TSV
if output="$(FAKE_CASE_JSON="$SAK_MED_TO_KJEDER" CALL_LOG="$CALL_LOG" bash "${WORK_DIR}/scripts/helved-v3-scenarioer.sh" utbetaling "${WORK_DIR}/v2-case.tsv" 2>"${WORK_DIR}/v2-case.stderr")"; then
    feil "V2-sak skulle blokkere V3-utbetaling."
fi
[[ "$output" == *"VERSJON må være V3"* ]] || feil "V2-sak ble ikke forklart."
[[ ! -s "$CALL_LOG" ]] || feil "V2-sak kalte en muterende hjelper."

cat >"${WORK_DIR}/validate-all-first.tsv" <<'TSV'
000000000000	V3	ja	ja
000000000001	V2	ja	ja
TSV
if output="$(FAKE_CASE_JSON="$SAK_MED_TO_KJEDER" CALL_LOG="$CALL_LOG" bash "${WORK_DIR}/scripts/helved-v3-scenarioer.sh" utbetaling "${WORK_DIR}/validate-all-first.tsv" 2>"${WORK_DIR}/validate-all-first.stderr")"; then
    feil "utbetaling skulle ha validert alle manifestradene før mutering."
fi
[[ "$output" == *"VERSJON må være V3"* ]] || feil "Blokkeringen i den siste manifestraden ble ikke vist."
[[ ! -s "$CALL_LOG" ]] || feil "utbetaling muterte en tidligere manifestrad før hele manifestet var validert."

cat >"${WORK_DIR}/too-few-chains.tsv" <<'TSV'
000000000000	V3	ja	ja
TSV
if output="$(FAKE_CASE_JSON="$SAK_MED_EN_KJEDE" CALL_LOG="$CALL_LOG" bash "${WORK_DIR}/scripts/helved-v3-scenarioer.sh" utbetaling "${WORK_DIR}/too-few-chains.tsv" 2>"${WORK_DIR}/too-few-chains.stderr")"; then
    feil "For få kjeder skulle blokkere utbetaling."
fi
[[ "$output" == *"minst to meldeperiodekjeder"* ]] || feil "For få kjeder ble ikke forklart."
[[ ! -s "$CALL_LOG" ]] || feil "For få kjeder kalte en muterende hjelper."

cat >"${WORK_DIR}/replay.tsv" <<'TSV'
000000000000	V3	ja	ja
TSV
output="$(FAKE_CASE_JSON="$SAK_MED_GODKJENT_MELDEKORT" CALL_LOG="$CALL_LOG" bash "${WORK_DIR}/scripts/helved-v3-scenarioer.sh" simuler-gate "${WORK_DIR}/replay.tsv" 2>"${WORK_DIR}/replay-gate.stderr")"
[[ "$output" == $'000000000000\tKLAR' ]] || feil "simuler-gate avviste en sak med tidligere meldekortbehandling."
: >"$CALL_LOG"
if output="$(FAKE_CASE_JSON="$SAK_MED_GODKJENT_MELDEKORT" CALL_LOG="$CALL_LOG" bash "${WORK_DIR}/scripts/helved-v3-scenarioer.sh" utbetaling "${WORK_DIR}/replay.tsv" 2>"${WORK_DIR}/replay.stderr")"; then
    feil "utbetaling godtok en sak med tidligere meldekortbehandling."
fi
[[ "$output" == *"urørte kjeder"* ]] || feil "Replay-gaten forklarte ikke at utbetaling krever urørte kjeder."
[[ ! -s "$CALL_LOG" ]] || feil "Replay-gaten kalte en muterende hjelper."

cat >"${WORK_DIR}/newer-digital.tsv" <<'TSV'
SAKSNUMMER
000000000000
TSV
: >"$CALL_LOG"
if output="$(FAKE_CASE_JSON="$SAK_DELVIS_MED_NYERE_DIGITAL" CALL_LOG="$CALL_LOG" bash "${WORK_DIR}/scripts/helved-v3-scenarioer.sh" fullfor "${WORK_DIR}/newer-digital.tsv" 2>"${WORK_DIR}/newer-digital.stderr")"; then
    feil "fullfor avanserte en papirsøknad foran en nyere digital søknad."
fi
grep -q "ikke er sakens nyeste søknadsbehandling" "${WORK_DIR}/newer-digital.stderr" || feil "Blokkeringen av nyere digital søknad ble ikke forklart."
[[ ! -s "$CALL_LOG" ]] || feil "fullfor kalte en muterende hjelper for en papirsøknad som ikke var nyest."

cat >"${WORK_DIR}/already-vedtatt.tsv" <<'TSV'
SAKSNUMMER
000000000000
TSV
output="$(FAKE_CASE_JSON="$SAK_MED_TO_KJEDER" CALL_LOG="$CALL_LOG" bash "${WORK_DIR}/scripts/helved-v3-scenarioer.sh" fullfor "${WORK_DIR}/already-vedtatt.tsv" 2>"${WORK_DIR}/already-vedtatt.stderr")"
[[ "$output" == $'000000000000\tVEDTATT' ]] || feil "En allerede vedtatt papirsøknad ble ikke gjenkjent."
[[ ! -s "$CALL_LOG" ]] || feil "En allerede vedtatt papirsøknad kalte en muterende hjelper."

output="$(FAKE_CASE_JSON="$SAK_VEDTATT_MED_NYERE_DIGITAL" CALL_LOG="$CALL_LOG" bash "${WORK_DIR}/scripts/helved-v3-scenarioer.sh" fullfor "${WORK_DIR}/already-vedtatt.tsv" 2>"${WORK_DIR}/already-vedtatt-newer-digital.stderr")"
[[ "$output" == $'000000000000\tVEDTATT' ]] || feil "En vedtatt papirsøknad ble blokkert av en nyere digital søknad."
[[ ! -s "$CALL_LOG" ]] || feil "En vedtatt papirsøknad med nyere digital søknad kalte en muterende hjelper."

printf 'Selvtesten bestått.\n'
