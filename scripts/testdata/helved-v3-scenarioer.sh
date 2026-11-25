#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MILJO=dev
# shellcheck source=./_lib.sh
source "${SCRIPT_DIR}/_lib.sh"

usage() {
    cat >&2 <<EOF
Bruk:
  $(basename "$0") FNR|SAKSNUMMER [TILTAKSINDEKS]
  $(basename "$0") forbered-papir FNR V2|V3 [TILTAKSINDEKS]
  $(basename "$0") fullfor MANIFEST.tsv
  $(basename "$0") simuler-gate MANIFEST.tsv
  $(basename "$0") utbetaling MANIFEST.tsv

Standardmodus kjører de seks eksisterende V3-stegene på én sak.
forbered-papir oppretter en ny sak, registrerer papirsøknaden og fører den til VEDTATT; eksisterende saker avvises.
Eksisterende saker avvises fordi oppdragsversjonen ikke kan verifiseres fra GET /sak.
Bruk legacy-modus eller fullfor for eksisterende saker først etter at oppdragsversjonen er verifisert fra en autoritativ kilde.
fullfor leser en saksnummerliste eller TSV med saksnummer i første kolonne og fører bare den nyeste papirsøknaden til VEDTATT.
simuler-gate leser en TSV med kolonnene SAKSNUMMER, VERSJON, OPPDRAG_BEREGNET og SIMULERING_OK.
VERSJON er operatørens bekreftelse fra OPPDRAGSVERSJON på en nyopprettet sak eller en annen autoritativ kilde, aldri fra dato alene.
utbetaling kontrollerer samme gate og krever urørte meldekortkjeder før de seks V3-stegene kjøres sekvensielt.
Gaten bruker ikke et eksternt Hel Ved-statusendepunkt; operatøren må fylle inn bekreftelsene.
I Q1 beregner Oppdragssystemet vanligvis rundt kl. 17 Europe/Oslo, men tidspunktet varierer og det er ikke prod-lignende nedetid.
Vent på fullført daglig beregning etter VEDTATT, og bekreft deretter med en faktisk simulering.
Skriptet sover ikke til kl. 17 og poller ikke Oppdragssystemet.
Normal migrering krever egne V2-saker og avklart historikk.
51 V3-saker dokumenterer ikke migrering.
Bruk aldri opphevSperrenStraks=true eller migrer-uten-kontrollsimulering.sh som bevis på normal migrering.
EOF
    exit 1
}

parse_manifest() {
    local mode="$1"
    local manifest="$2"

    python3 - "$mode" "$manifest" <<'PY'
import re
import sys

mode, path = sys.argv[1:]
seen = set()
rows = []
first_record = True
expected_header = ["SAKSNUMMER", "VERSJON", "OPPDRAG_BEREGNET", "SIMULERING_OK"]

try:
    with open(path, encoding="utf-8") as manifest:
        for line_number, raw_line in enumerate(manifest, start=1):
            line = raw_line.rstrip("\r\n")
            if not line.strip() or line.lstrip().startswith("#"):
                continue
            fields = line.split("\t")

            if mode == "fullfor":
                if first_record and fields[0] == "SAKSNUMMER":
                    if any(not field for field in fields):
                        raise ValueError(f"Ugyldig overskrift på linje {line_number}.")
                    first_record = False
                    continue
                first_record = False
                saksnummer = fields[0]
                if not re.fullmatch(r"[0-9]+", saksnummer):
                    raise ValueError(f"Ugyldig saksnummer på linje {line_number}.")
                if saksnummer not in seen:
                    rows.append(saksnummer)
                    seen.add(saksnummer)
                continue

            if mode != "simuler-gate":
                raise ValueError("Ukjent manifesttype.")
            if first_record and fields == expected_header:
                first_record = False
                continue
            first_record = False
            if fields and fields[0] == "SAKSNUMMER" and len(fields) == 4:
                raise ValueError(f"Ugyldig overskrift på linje {line_number}.")
            if len(fields) != 4:
                raise ValueError(f"Forventet fire tabulatorseparerte felt på linje {line_number}.")
            saksnummer, versjon, oppdrag_beregnet, simulering_ok = fields
            if not re.fullmatch(r"[0-9]+", saksnummer):
                raise ValueError(f"Ugyldig saksnummer på linje {line_number}.")
            if versjon not in ("V2", "V3"):
                raise ValueError(f"Ugyldig versjon på linje {line_number}.")
            if oppdrag_beregnet not in ("ja", "nei") or simulering_ok not in ("ja", "nei"):
                raise ValueError(f"Bekreftelser må være ja eller nei på linje {line_number}.")
            if saksnummer in seen:
                raise ValueError(f"Duplikat saksnummer på linje {line_number}.")
            rows.append("\t".join(fields))
            seen.add(saksnummer)
except (OSError, UnicodeError, ValueError) as error:
    print(f"FEIL: {error}", file=sys.stderr)
    sys.exit(1)

if not rows:
    print("FEIL: Manifestet inneholder ingen saker.", file=sys.stderr)
    sys.exit(1)

print("\n".join(rows))
PY
}

nyeste_papirbehandling() {
    python3 - "$1" <<'PY'
import json
import sys

try:
    sak = json.loads(sys.argv[1])
    behandlinger = sak["rammebehandlinger"]
    if not isinstance(behandlinger, list):
        raise ValueError
    papirbehandlinger = []
    soknadsbehandlinger = []
    ukjent_opprettelsestid = False
    for behandling in behandlinger:
        if behandling.get("type") != "SØKNADSBEHANDLING":
            continue
        opprettet = behandling.get("opprettet")
        if not isinstance(opprettet, str) or not opprettet:
            ukjent_opprettelsestid = True
        else:
            soknadsbehandlinger.append((opprettet, behandling))
        soknad = behandling.get("søknad") or {}
        soknadstype = soknad.get("søknadstype") or behandling.get("søknadstype")
        if soknadstype in ("PAPIR_SKJEMA", "PAPIR_FRIHAND"):
            if not isinstance(opprettet, str) or not opprettet:
                print("UKJENT\tUKJENT")
                sys.exit(0)
            papirbehandlinger.append((opprettet, behandling))
    if not papirbehandlinger:
        print("INGEN\tUKJENT")
        sys.exit(0)
    nyeste_papir = max(papirbehandlinger, key=lambda par: par[0])
    nyeste_soknad = max(soknadsbehandlinger, key=lambda par: par[0])
    behandling = nyeste_papir[1]
    status = behandling.get("status")
    tillatte = {
        "VEDTATT",
        "UNDER_AUTOMATISK_BEHANDLING",
        "KLAR_TIL_BEHANDLING",
        "UNDER_BEHANDLING",
        "KLAR_TIL_BESLUTNING",
        "UNDER_BESLUTNING",
        "AVBRUTT",
    }
    status = status if status in tillatte else "UKJENT"
    if ukjent_opprettelsestid:
        nyeste_total = "UKJENT"
    else:
        nyeste_total = "ja" if nyeste_papir[0] == nyeste_soknad[0] else "nei"
    print(f"{status}\t{nyeste_total}")
except (AttributeError, KeyError, TypeError, ValueError, json.JSONDecodeError):
    print("UKJENT\tUKJENT")
PY
}

nyeste_papirstatus() {
    local behandling_info
    behandling_info="$(nyeste_papirbehandling "$1")"
    printf '%s\n' "${behandling_info%%$'\t'*}"
}

vurder_simuleringsgate() {
    python3 - "$1" "${2:-nei}" <<'PY'
import json
import sys
from datetime import date

sak_json = sys.argv[1]
krever_urorte_kjeder = sys.argv[2] == "ja"
aktive_meldekortstatuser = {
    "KLAR_TIL_BEHANDLING",
    "UNDER_BEHANDLING",
    "KLAR_TIL_BESLUTNING",
    "UNDER_BESLUTNING",
}
kjente_meldekortstatuser = aktive_meldekortstatuser | {"GODKJENT", "AUTOMATISK_BEHANDLET", "AVBRUTT"}
grunner = []

try:
    sak = json.loads(sak_json)
    if not isinstance(sak, dict) or not sak.get("sakId"):
        raise ValueError
    rammebehandlinger = sak["rammebehandlinger"]
    kjeder = sak["meldeperiodeKjeder"]
    meldekortbehandlinger = sak["meldekortbehandlinger"]
    åpne_behandlinger = sak["åpneBehandlinger"]
    if not isinstance(rammebehandlinger, list) or not isinstance(kjeder, list):
        raise ValueError
    if not isinstance(meldekortbehandlinger, dict):
        raise ValueError
    if not isinstance(åpne_behandlinger, list):
        raise ValueError
    if åpne_behandlinger:
        grunner.append("ÅPEN_BEHANDLING")
    if "oppdragsversjon" in sak and sak["oppdragsversjon"] != "V3":
        grunner.append("VERSJON_I_SAK_IKKE_V3")

    papirbehandlinger = []
    for behandling in rammebehandlinger:
        if behandling.get("type") == "SØKNADSBEHANDLING":
            soknad = behandling.get("søknad") or {}
            soknadstype = soknad.get("søknadstype") or behandling.get("søknadstype")
            if soknadstype in ("PAPIR_SKJEMA", "PAPIR_FRIHAND"):
                opprettet = behandling.get("opprettet")
                if not isinstance(opprettet, str) or not opprettet:
                    grunner.append("SAKSTILSTAND_UKJENT")
                else:
                    papirbehandlinger.append((opprettet, behandling))
    if not papirbehandlinger:
        grunner.append("MANGLER_PAPIRBEHANDLING")
    elif max(papirbehandlinger, key=lambda par: par[0])[1].get("status") != "VEDTATT":
        grunner.append("PAPIRBEHANDLING_IKKE_VEDTATT")

    if len(kjeder) < 2:
        grunner.append("FOR_FÅ_KJEDER")
    else:
        for kjede in kjeder[:2]:
            if not kjede.get("id") or "åpenBehandlingId" not in kjede:
                grunner.append("SAKSTILSTAND_UKJENT")
            if kjede.get("åpenBehandlingId") is not None:
                grunner.append("ÅPEN_BEHANDLING")
            behandling_ids = kjede.get("meldekortbehandlingIder")
            if not isinstance(behandling_ids, list):
                grunner.append("SAKSTILSTAND_UKJENT")
            else:
                if krever_urorte_kjeder and behandling_ids:
                    grunner.append("MELDEKORT_FINNES")
                for behandling_id in behandling_ids:
                    behandling = meldekortbehandlinger.get(str(behandling_id))
                    if not isinstance(behandling, dict):
                        grunner.append("SAKSTILSTAND_UKJENT")
                        continue
                    status = behandling.get("status")
                    if status in aktive_meldekortstatuser:
                        grunner.append("ÅPEN_BEHANDLING")
                    elif status not in kjente_meldekortstatuser:
                        grunner.append("SAKSTILSTAND_UKJENT")

            periode = kjede.get("periode") or {}
            if not periode.get("fraOgMed") or not periode.get("tilOgMed"):
                grunner.append("SAKSTILSTAND_UKJENT")
            else:
                try:
                    fra_og_med = date.fromisoformat(periode["fraOgMed"])
                    til_og_med = date.fromisoformat(periode["tilOgMed"])
                    if fra_og_med > til_og_med:
                        grunner.append("SAKSTILSTAND_UKJENT")
                except (TypeError, ValueError):
                    grunner.append("SAKSTILSTAND_UKJENT")

            gir_rett = (kjede.get("sisteMeldeperiode") or {}).get("girRett")
            if not isinstance(gir_rett, dict):
                grunner.append("SAKSTILSTAND_UKJENT")
                continue
            hverdager_med_rett = 0
            for dato, gir_rett_denne_dagen in gir_rett.items():
                try:
                    ukedag = date.fromisoformat(dato).weekday()
                except (TypeError, ValueError):
                    grunner.append("SAKSTILSTAND_UKJENT")
                    continue
                if gir_rett_denne_dagen is True and ukedag < 5:
                    hverdager_med_rett += 1
            if hverdager_med_rett < 2:
                grunner.append("FOR_FÅ_RETTSDAGER")
except (KeyError, TypeError, ValueError, json.JSONDecodeError):
    grunner.append("SAKSTILSTAND_UKJENT")

for grunn in dict.fromkeys(grunner):
    print(grunn)
PY
}

vis_gategrunn() {
    case "$1" in
    VERSJON_MÅ_VÆRE_V3) printf 'VERSJON må være V3 for denne V3-flyten.' ;;
    VERSJON_I_SAK_IKKE_V3) printf 'Sakens oppdragsversjon er ikke V3.' ;;
    OPPDRAG_IKKE_BEREGNET) printf 'OPPDRAG_BEREGNET må være ja etter fullført daglig Q1-beregning.' ;;
    SIMULERING_IKKE_OK) printf 'SIMULERING_OK må være ja etter en faktisk separat simulering.' ;;
    MANGLER_PAPIRBEHANDLING) printf 'Saken mangler en papirsøknadsbehandling.' ;;
    PAPIRBEHANDLING_IKKE_VEDTATT) printf 'Nyeste papirsøknadsbehandling er ikke VEDTATT.' ;;
    ÅPEN_BEHANDLING) printf 'Saken har en åpen behandling i V3-flyten.' ;;
    MELDEKORT_FINNES) printf 'En av de to første meldeperiodekjedene har allerede meldekortbehandlinger; utbetaling krever urørte kjeder.' ;;
    FOR_FÅ_KJEDER) printf 'Saken har ikke minst to meldeperiodekjeder.' ;;
    FOR_FÅ_RETTSDAGER) printf 'En av de to første kjedene mangler to hverdager som gir rett.' ;;
    SAKSTILSTAND_UKJENT) printf 'Sakens behandlingstilstand kan ikke leses sikkert.' ;;
    KUNNE_IKKE_LESE_SAK) printf 'Saken kunne ikke leses fra saksbehandlings-API-et.' ;;
    *) printf 'Ukjent kontrollfeil.' ;;
    esac
}

simuler_gate() {
    local rows="$1"
    local vis_klare="$2"
    local krev_urorte_kjeder="${3:-nei}"
    local saksnummer versjon oppdrag_beregnet simulering_ok sak_json sak_grunner grunn
    local antall_blokkerte=0

    while IFS=$'\t' read -r saksnummer versjon oppdrag_beregnet simulering_ok; do
        local -a blokkeringer=()
        [[ "$versjon" == "V3" ]] || blokkeringer+=(VERSJON_MÅ_VÆRE_V3)
        [[ "$oppdrag_beregnet" == "ja" ]] || blokkeringer+=(OPPDRAG_IKKE_BEREGNET)
        [[ "$simulering_ok" == "ja" ]] || blokkeringer+=(SIMULERING_IKKE_OK)

        if ! sak_json="$(http_saksbehandler GET "/sak/${saksnummer}")"; then
            blokkeringer+=(KUNNE_IKKE_LESE_SAK)
        elif ! sak_grunner="$(vurder_simuleringsgate "$sak_json" "$krev_urorte_kjeder")"; then
            blokkeringer+=(SAKSTILSTAND_UKJENT)
        elif [[ -n "$sak_grunner" ]]; then
            while IFS= read -r grunn; do
                [[ -n "$grunn" ]] && blokkeringer+=("$grunn")
            done <<<"$sak_grunner"
        fi

        if [[ ${#blokkeringer[@]} -gt 0 ]]; then
            local begrunnelse=""
            for grunn in "${blokkeringer[@]}"; do
                [[ -n "$begrunnelse" ]] && begrunnelse+="; "
                begrunnelse+="$(vis_gategrunn "$grunn")"
            done
            printf '%s\tBLOKKERT\t%s\n' "$saksnummer" "$begrunnelse"
            antall_blokkerte=$((antall_blokkerte + 1))
        elif [[ "$vis_klare" == "ja" ]]; then
            printf '%s\tKLAR\n' "$saksnummer"
        fi
    done <<<"$rows"

    ((antall_blokkerte == 0))
}

assert_kjede_uten_åpen_behandling() {
    python3 - "$1" "$2" <<'PY'
import json
import sys

try:
    sak = json.loads(sys.argv[1])
    indeks = int(sys.argv[2])
    kjede = sak["meldeperiodeKjeder"][indeks]
    if "åpenBehandlingId" not in kjede or kjede["åpenBehandlingId"] is not None:
        raise ValueError("Kjeden har en åpen behandling.")
except (IndexError, KeyError, TypeError, ValueError, json.JSONDecodeError) as error:
    print(f"FEIL: {error or 'Ukjent tilstand i meldeperiodekjeden.'}", file=sys.stderr)
    sys.exit(1)
PY
}

assert_rammebehandlingsstatus() {
    python3 - "$1" "$2" "$3" <<'PY'
import json
import sys

try:
    sak = json.loads(sys.argv[1])
    behandling_id, forventet_status = sys.argv[2:]
    behandling = next(b for b in sak["rammebehandlinger"] if b["id"] == behandling_id)
    status = behandling["status"]
except (KeyError, StopIteration, TypeError, json.JSONDecodeError) as error:
    print(f"FEIL: Kan ikke lese behandlingstilstanden: {error}", file=sys.stderr)
    sys.exit(1)

if status != forventet_status:
    print(
        f"FEIL: Behandlingstilstanden er {status}, forventet {forventet_status}.",
        file=sys.stderr,
    )
    sys.exit(1)
PY
}

forbered_papir() {
    local fnr="$1"
    local versjon="$2"
    local tiltaksindeks="${3:-0}"
    local saksresultat saksnummer opprettet registrering fullfor_resultat sak_id behandling_id

    krev_syntetisk_fnr "$fnr"
    [[ "$versjon" == "V2" || "$versjon" == "V3" ]] || usage
    [[ "$tiltaksindeks" =~ ^[0-9]+$ ]] || fail "TILTAKSINDEKS må være et ikke-negativt heltall."
    require_server

    saksresultat="$("${SCRIPT_DIR}/hent-eller-opprett-sak.sh" "$fnr" "$versjon" --med-opprettelse)"
    saksnummer="$(printf '%s\n' "$saksresultat" | sed -n 's/^SAKSNUMMER=//p')"
    opprettet="$(printf '%s\n' "$saksresultat" | sed -n 's/^OPPRETTET=//p')"
    [[ "$saksnummer" =~ ^[0-9]+$ ]] || fail "Fikk ugyldig saksnummer fra hent-eller-opprett-sak.sh."
    [[ "$opprettet" == "true" || "$opprettet" == "false" ]] || fail "hent-eller-opprett-sak.sh returnerte ikke en gyldig OPPRETTET-verdi."
    [[ "$opprettet" == "true" ]] || fail "forbered-papir kan bare brukes med en nyopprettet sak. Oppdragsversjonen på en eksisterende sak kan ikke verifiseres fra GET /sak. Bruk en nyopprettet sak, eller verifiser versjonen fra en autoritativ kilde før du bruker legacy-modus eller fullfor."

    registrering="$(TILTAKSINDEKS="$tiltaksindeks" "${SCRIPT_DIR}/registrer-papir-soknad.sh" "$saksnummer")"
    [[ -n "$registrering" ]] || fail "registrer-papir-soknad.sh returnerte ingen behandling."
    fullfor_resultat="$("${SCRIPT_DIR}/fullfor-soknadsbehandling.sh" "$saksnummer")"
    sak_id="$(printf '%s\n' "$fullfor_resultat" | sed -n 's/^SAK_ID=//p')"
    behandling_id="$(printf '%s\n' "$fullfor_resultat" | sed -n 's/^BEHANDLING_ID=//p')"
    [[ -n "$sak_id" && -n "$behandling_id" ]] || fail "fullfor-soknadsbehandling.sh returnerte ikke SAK_ID og BEHANDLING_ID."
    printf 'SAKSNUMMER=%s\nOPPDRAGSVERSJON=%s\nSAK_ID=%s\nBEHANDLING_ID=%s\n' "$saksnummer" "$versjon" "$sak_id" "$behandling_id"
}

fullfor_batch() {
    local rows="$1"
    local saksnummer sak_json behandling_info status nyeste_overall

    CURRENT_BATCH_CASE=""
    trap 'if [[ -n ${CURRENT_BATCH_CASE:-} ]]; then printf "%s\tFEIL\n" "$CURRENT_BATCH_CASE"; fi' EXIT
    while IFS= read -r saksnummer; do
        CURRENT_BATCH_CASE="$saksnummer"
        if ! sak_json="$(http_saksbehandler GET "/sak/${saksnummer}")"; then
            fail "Kunne ikke lese sak ${saksnummer} før behandling."
        fi
        behandling_info="$(nyeste_papirbehandling "$sak_json")"
        IFS=$'\t' read -r status nyeste_overall <<<"$behandling_info"
        case "$status" in
        VEDTATT)
            printf '%s\tVEDTATT\n' "$saksnummer"
            CURRENT_BATCH_CASE=""
            continue
            ;;
        UNDER_AUTOMATISK_BEHANDLING | KLAR_TIL_BEHANDLING | UNDER_BEHANDLING | KLAR_TIL_BESLUTNING | UNDER_BESLUTNING)
            ;;
        *)
            fail "Sak ${saksnummer} har ukjent eller ikke-gjenopptakbar papirsøknadstilstand (${status})."
            ;;
        esac
        [[ "$nyeste_overall" == "ja" ]] || fail "Sak ${saksnummer} har en nyeste papirsøknad som ikke er sakens nyeste søknadsbehandling; fullfor kan derfor ikke fortsette trygt."

        "${SCRIPT_DIR}/fullfor-soknadsbehandling.sh" "$saksnummer" >/dev/null
        sak_json="$(http_saksbehandler GET "/sak/${saksnummer}")"
        status="$(nyeste_papirstatus "$sak_json")"
        [[ "$status" == "VEDTATT" ]] || fail "Sak ${saksnummer} ble ikke bekreftet VEDTATT etter behandling."
        printf '%s\tVEDTATT\n' "$saksnummer"
        CURRENT_BATCH_CASE=""
    done <<<"$rows"
    trap - EXIT
}

run_v3_scenario() {
    local input="$1"
    local tiltaksindeks="${2:-0}"
    local kontrollert="${3:-nei}"
    local saksnummer_only="${4:-nei}"
    local saksnummer sak_json sak_id stans_id stans_fra status

    if [[ "$saksnummer_only" == "ja" ]]; then
        saksnummer="$input"
    elif [[ "$input" =~ ^[0-9]{11}$ ]]; then
        saksnummer="$("${SCRIPT_DIR}/send-soknad-dev.sh" "$input" "$tiltaksindeks" | sed -n 's/^SAKSNUMMER=//p')"
    else
        saksnummer="$input"
        krev_syntetisk_fnr "$(jval "$(http_saksbehandler GET "/sak/${saksnummer}")" "fnr.verdi")"
    fi
    ((10#${saksnummer:0:8} > 20261110)) || log "ADVARSEL: Sak ${saksnummer} er trolig opprettet før V3 og utbetales med V2."

    local DELTATT="DELTATT_UTEN_LØNN_I_TILTAKET"
    local FRAVAER="FRAVÆR_ANNET"

    if [[ "$kontrollert" == "ja" ]]; then
        sak_json="$(http_saksbehandler GET "/sak/${saksnummer}")"
        [[ "$(nyeste_papirstatus "$sak_json")" == "VEDTATT" ]] || fail "Nyeste papirsøknadsbehandling er ikke VEDTATT."
        log "Steg 1: innvilgelse er allerede vedtatt"
    else
        log "Steg 1: innvilgelse"
        "${SCRIPT_DIR}/fullfor-soknadsbehandling.sh" "$saksnummer" >/dev/null
    fi

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
    local dag_kjede_1
    dag_kjede_1="$(fraværsdag 1)"
    er_godkjent 1 || "${SCRIPT_DIR}/fyll-og-iverksett-meldekort.sh" "$saksnummer" kjede=1 "${dag_kjede_1}=${FRAVAER}" >/dev/null

    log "Steg 4: korrigering som gir feilutbetaling"
    if [[ "$kontrollert" == "ja" ]]; then
        sak_json="$(http_saksbehandler GET "/sak/${saksnummer}")"
        assert_kjede_uten_åpen_behandling "$sak_json" 0
    fi
    local dag_kjede_0
    dag_kjede_0="$(fraværsdag 0)"
    "${SCRIPT_DIR}/fyll-og-iverksett-meldekort.sh" "$saksnummer" kjede=0 "${dag_kjede_0}=${FRAVAER}" >/dev/null
    if [[ "$kontrollert" == "ja" ]]; then
        sak_json="$(http_saksbehandler GET "/sak/${saksnummer}")"
        assert_kjede_uten_åpen_behandling "$sak_json" 0
    fi

    log "Steg 5: korrigering som gir etterbetaling"
    if [[ "$kontrollert" == "ja" ]]; then
        sak_json="$(http_saksbehandler GET "/sak/${saksnummer}")"
        assert_kjede_uten_åpen_behandling "$sak_json" 1
    fi
    "${SCRIPT_DIR}/fyll-og-iverksett-meldekort.sh" "$saksnummer" kjede=1 "${dag_kjede_1}=${DELTATT}" >/dev/null
    if [[ "$kontrollert" == "ja" ]]; then
        sak_json="$(http_saksbehandler GET "/sak/${saksnummer}")"
        assert_kjede_uten_åpen_behandling "$sak_json" 1
    fi

    log "Steg 6: stans fra andre meldeperiode"
    sak_json="$(http_saksbehandler GET "/sak/${saksnummer}")"
    sak_id="$(jval "$sak_json" "sakId")"
    stans_fra="$(jval "$sak_json" "meldeperiodeKjeder[1].periode.fraOgMed")"
    if [[ "$kontrollert" == "ja" ]]; then
        assert_kjede_uten_åpen_behandling "$sak_json" 0
        assert_kjede_uten_åpen_behandling "$sak_json" 1
    fi
    read -r stans_id _ <<<"$("${SCRIPT_DIR}/start-revurdering.sh" "$sak_id" STANS)"
    if [[ "$kontrollert" == "ja" ]]; then
        sak_json="$(http_saksbehandler GET "/sak/${saksnummer}")"
        assert_rammebehandlingsstatus "$sak_json" "$stans_id" "UNDER_BEHANDLING"
    fi
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
    if [[ "$kontrollert" == "ja" ]]; then
        sak_json="$(http_saksbehandler GET "/sak/${saksnummer}")"
        assert_rammebehandlingsstatus "$sak_json" "$stans_id" "UNDER_BEHANDLING"
    fi
    "${SCRIPT_DIR}/send-til-beslutning.sh" "$sak_id" "$stans_id" >/dev/null
    if [[ "$kontrollert" == "ja" ]]; then
        sak_json="$(http_saksbehandler GET "/sak/${saksnummer}")"
        assert_rammebehandlingsstatus "$sak_json" "$stans_id" "KLAR_TIL_BESLUTNING"
    fi
    "${SCRIPT_DIR}/ta-behandling.sh" "$sak_id" "$stans_id" >/dev/null
    if [[ "$kontrollert" == "ja" ]]; then
        sak_json="$(http_saksbehandler GET "/sak/${saksnummer}")"
        assert_rammebehandlingsstatus "$sak_json" "$stans_id" "UNDER_BESLUTNING"
    fi
    "${SCRIPT_DIR}/iverksett.sh" "$sak_id" "$stans_id" >/dev/null
    if [[ "$kontrollert" == "ja" ]]; then
        sak_json="$(http_saksbehandler GET "/sak/${saksnummer}")"
        assert_rammebehandlingsstatus "$sak_json" "$stans_id" "VEDTATT"
    fi

    echo "SAKSNUMMER=${saksnummer}"
    echo "Kontroller utbetalingene i Utbetalingsportalen: https://utbetalingsportalen.intern.dev.nav.no/oppdragsinfo/oppdrag"
    echo "og i Peisen: https://peisen.intern.dev.nav.no/"
}

fullfor_utbetaling() {
    local rows="$1"
    local saksnummer versjon oppdrag_beregnet simulering_ok

    if ! simuler_gate "$rows" "nei" "ja"; then
        return 1
    fi

    CURRENT_BATCH_CASE=""
    trap 'if [[ -n ${CURRENT_BATCH_CASE:-} ]]; then printf "%s\tFEIL\n" "$CURRENT_BATCH_CASE"; fi' EXIT
    while IFS=$'\t' read -r saksnummer versjon oppdrag_beregnet simulering_ok; do
        CURRENT_BATCH_CASE="$saksnummer"
        run_v3_scenario "$saksnummer" 0 "ja" "ja"
        printf '%s\tGJENNOMFØRT\n' "$saksnummer"
        CURRENT_BATCH_CASE=""
    done <<<"$rows"
    trap - EXIT
}

case "${1:-}" in
forbered-papir)
    [[ $# -ge 3 && $# -le 4 ]] || usage
    [[ "$3" == "V2" || "$3" == "V3" ]] || usage
    if [[ $# -eq 4 ]]; then
        [[ "$4" =~ ^[0-9]+$ ]] || fail "TILTAKSINDEKS må være et ikke-negativt heltall."
    fi
    forbered_papir "$2" "$3" "${4:-0}"
    ;;
fullfor)
    [[ $# -eq 2 ]] || usage
    manifest_rader="$(parse_manifest fullfor "$2")"
    require_server
    fullfor_batch "$manifest_rader"
    ;;
simuler-gate)
    [[ $# -eq 2 ]] || usage
    manifest_rader="$(parse_manifest simuler-gate "$2")"
    require_server
    simuler_gate "$manifest_rader" "ja"
    ;;
utbetaling)
    [[ $# -eq 2 ]] || usage
    manifest_rader="$(parse_manifest simuler-gate "$2")"
    require_server
    fullfor_utbetaling "$manifest_rader"
    ;;
help | -h | --help)
    usage
    ;;
*)
    [[ $# -ge 1 && $# -le 2 ]] || usage
    require_server
    run_v3_scenario "$1" "${2:-0}" "nei"
    ;;
esac
