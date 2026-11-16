#!/usr/bin/env bash
set -euo pipefail

log() {
    printf '[%s] %s\n' "$(basename "${0:-script}")" "$*" >&2
}

fail() {
    log "FEIL: $*"
    exit 1
}

# MILJO=dev kjører mot sb-api i dev med OBO-tokens fra filer (ASCII i navnet fordi bash ikke tillater æøå i variabelnavn).
MILJO="${MILJO:-lokal}"
LIB_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEV_TOKEN_DIR="${DEV_TOKEN_DIR:-${LIB_DIR}/.dev-tokens}"

# Gir identen til et gyldig OBO-token med rollen fra .dev-tokens/ (lagret med dev-token.sh), fra en annen ident enn $2.
# DEV_SAKSBEHANDLER og DEV_BESLUTTER velger en bestemt ident.
velg_dev_ident() {
    local rolle="$1" unntatt="${2:-}" valgt="$3" fil
    if [[ -n $valgt ]]; then
        fil="${DEV_TOKEN_DIR}/dev-token-${valgt}"
        python3 "${LIB_DIR}/_dev_token.py" beskriv "$fil" >/dev/null 2>&1 ||
            fail "Mangler gyldig token for ${valgt} i ${DEV_TOKEN_DIR}. Kjør: ${LIB_DIR}/dev-token.sh"
    else
        fil="$(python3 "${LIB_DIR}/_dev_token.py" velg "$DEV_TOKEN_DIR" "$rolle" "$unntatt")" ||
            fail "Ingen gyldige tokens med rollen ${rolle}${unntatt:+ fra en annen ident enn ${unntatt}} i ${DEV_TOKEN_DIR}. Kjør: ${LIB_DIR}/dev-token.sh (og ${LIB_DIR}/dev-token.sh liste for å se hva som finnes)"
    fi
    printf '%s' "${fil##*/dev-token-}"
}

case "$MILJO" in
lokal)
    BASE_URL="${BASE_URL:-http://localhost:8080}"
    TOKEN_SAKSBEHANDLER="${TOKEN_SAKSBEHANDLER:-TokenMcTokenface}"
    TOKEN_BESLUTTER="${TOKEN_BESLUTTER:-TokenMcTokenface2}"
    ;;
dev)
    BASE_URL="${BASE_URL:-https://tiltakspenger-saksbehandling-api.intern.dev.nav.no}"
    if [[ -z ${TOKEN_SAKSBEHANDLER:-} ]]; then
        IDENT_SAKSBEHANDLER="$(velg_dev_ident saksbehandler "" "${DEV_SAKSBEHANDLER:-}")"
        TOKEN_SAKSBEHANDLER="$(tr -d '[:space:]' <"${DEV_TOKEN_DIR}/dev-token-${IDENT_SAKSBEHANDLER}")"
    fi
    if [[ -z ${TOKEN_BESLUTTER:-} ]]; then
        IDENT_BESLUTTER="$(velg_dev_ident beslutter "${IDENT_SAKSBEHANDLER:-}" "${DEV_BESLUTTER:-}")"
        TOKEN_BESLUTTER="$(tr -d '[:space:]' <"${DEV_TOKEN_DIR}/dev-token-${IDENT_BESLUTTER}")"
    fi
    log "Dev: saksbehandler ${IDENT_SAKSBEHANDLER:-fra TOKEN_SAKSBEHANDLER}, beslutter ${IDENT_BESLUTTER:-fra TOKEN_BESLUTTER}"
    ;;
*) fail "Ukjent MILJO=${MILJO}. Bruk lokal eller dev." ;;
esac
# Eksporteres så _meldekort_flyt.py får de samme verdiene.
export MILJO BASE_URL TOKEN_SAKSBEHANDLER TOKEN_BESLUTTER

require_server() {
    curl -sSf "${BASE_URL}/isready" >/dev/null || fail "sb-api svarer ikke på ${BASE_URL}/isready."
}

# Bare syntetiske fnr slipper gjennom: Navs serie (måned + 40, tredje siffer 4–7, Dolly/testnorge) og Skatteetatens (måned + 80, tredje siffer 8–9).
# Ekte fnr og D-nummer har 0 eller 1 som tredje siffer.
# 4 og 5 som tredje siffer kan være H-nummer på ekte personer, så de avvises også.
er_syntetisk_fnr() {
    [[ "$1" =~ ^[0-9]{2}[4-9][0-9]{8}$ ]]
}

krev_syntetisk_fnr() {
    er_syntetisk_fnr "$1" || fail "Fødselsnummeret er ikke i den syntetiske serien (4–9 som tredje siffer)."
}

http() {
    local method="$1"
    local token="$2"
    local path="$3"
    shift 3

    local -a cmd=(curl -sS --fail-with-body -X "$method" "${BASE_URL}${path}")
    if [[ "$token" != "-" ]]; then
        cmd+=(-H "Authorization: Bearer ${token}")
    fi
    if [[ $# -gt 0 ]]; then
        cmd+=(-H "Content-Type: application/json" --data "$1")
    fi
    local svar
    svar="$("${cmd[@]}")" || {
        printf '%s %s: %s\n' "$method" "$path" "$svar" >&2
        return 1
    }
    printf '%s' "$svar"
}

http_noauth() {
    local method="$1"
    local path="$2"
    if [[ $# -ge 3 ]]; then
        http "$method" "-" "$path" "$3"
    else
        http "$method" "-" "$path"
    fi
}

http_saksbehandler() {
    local method="$1"
    local path="$2"
    if [[ $# -ge 3 ]]; then
        http "$method" "$TOKEN_SAKSBEHANDLER" "$path" "$3"
    else
        http "$method" "$TOKEN_SAKSBEHANDLER" "$path"
    fi
}

http_beslutter() {
    local method="$1"
    local path="$2"
    if [[ $# -ge 3 ]]; then
        http "$method" "$TOKEN_BESLUTTER" "$path" "$3"
    else
        http "$method" "$TOKEN_BESLUTTER" "$path"
    fi
}

jval() {
    if [[ $# -ne 2 ]]; then
        fail "jval krever JSON og uttrykk."
    fi
    local json_input="$1"
    local expr="$2"

    python3 - "$expr" "$json_input" <<'PY'
import json
import re
import sys

expr = sys.argv[1]
data = json.loads(sys.argv[2])

def render(value):
    if value is None:
        print("null")
    elif isinstance(value, bool):
        print("true" if value else "false")
    elif isinstance(value, (dict, list)):
        print(json.dumps(value, ensure_ascii=False))
    else:
        print(value)

def resolve_path(obj, path):
    current = obj
    if not path:
        return current
    for segment in path.split("."):
        if not segment:
            continue
        i = 0
        key = ""
        while i < len(segment) and segment[i] != "[":
            key += segment[i]
            i += 1
        if key:
            current = current[key]
        while i < len(segment):
            if segment[i] != "[":
                raise ValueError(f"Ugyldig segment: {segment}")
            j = segment.find("]", i)
            if j == -1:
                raise ValueError(f"Mangler ] i segment: {segment}")
            idx = int(segment[i + 1:j])
            current = current[idx]
            i = j + 1
    return current

try:
    if re.fullmatch(r"[A-Za-z0-9_æøåÆØÅ.\[\]-]+", expr):
        result = resolve_path(data, expr)
    else:
        code = f"data{expr}" if expr.startswith(".") else expr
        result = eval(code, {"data": data, "__builtins__": {}}, {})
except Exception as exc:
    print(f"jval-feil for uttrykk '{expr}': {exc}", file=sys.stderr)
    sys.exit(1)

render(result)
PY
}

pretty_json() {
    python3 -m json.tool
}

PDF_UT_DIR="${PDF_UT_DIR:-/tmp/tiltakspenger-pdfer}"

# POST-er mot en forhåndsvisnings-route og lagrer PDF-responsen til fil.
# Routen svarer med én application/pdf fra pdfgenrs. Skriver ut filstien som lagres.
post_og_lagre_pdfer() {
    if [[ $# -ne 3 ]]; then
        fail "post_og_lagre_pdfer krever PATH, BODY og NAVN."
    fi
    local path="$1"
    local body="$2"
    local navn="$3"

    mkdir -p "$PDF_UT_DIR"
    local bodyfil
    bodyfil="$(mktemp)"

    local http_status
    http_status="$(
        curl -sS -X POST "${BASE_URL}${path}" \
            -H "Authorization: Bearer ${TOKEN_SAKSBEHANDLER}" \
            -H "Content-Type: application/json" \
            --data "$body" \
            -o "$bodyfil" -w '%{http_code}'
    )"
    if [[ ! "$http_status" =~ ^2[0-9][0-9]$ ]]; then
        local feilmelding
        feilmelding="$(cat "$bodyfil")"
        rm -f "$bodyfil"
        fail "Forhåndsvisning feilet (HTTP ${http_status}): ${feilmelding}"
    fi

    local utfil="${PDF_UT_DIR}/${navn}.pdf"
    mv "$bodyfil" "$utfil"
    printf '%s\n' "$utfil"
}

urlencode() {
    if [[ $# -ne 1 ]]; then
        fail "urlencode krever én streng."
    fi
    python3 - "$1" <<'PY'
import sys
import urllib.parse

print(urllib.parse.quote(sys.argv[1], safe=""))
PY
}
