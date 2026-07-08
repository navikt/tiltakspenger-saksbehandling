#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:8080}"
TOKEN_SAKSBEHANDLER="${TOKEN_SAKSBEHANDLER:-TokenMcTokenface}"
TOKEN_BESLUTTER="${TOKEN_BESLUTTER:-TokenMcTokenface2}"

log() {
    printf '[%s] %s\n' "$(basename "${0:-script}")" "$*" >&2
}

fail() {
    log "FEIL: $*"
    exit 1
}

require_server() {
    curl -sSf "${BASE_URL}/isready" >/dev/null || fail "LokalMain svarer ikke på ${BASE_URL}/isready."
}

http() {
    local method="$1"
    local token="$2"
    local path="$3"
    shift 3

    local -a cmd=(curl -sSf -X "$method" "${BASE_URL}${path}")
    if [[ "$token" != "-" ]]; then
        cmd+=(-H "Authorization: Bearer ${token}")
    fi
    if [[ $# -gt 0 ]]; then
        cmd+=(-H "Content-Type: application/json" --data "$1")
    fi
    "${cmd[@]}"
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

# POST-er mot en forhåndsvisnings-route og lagrer PDF-responsen(e) til fil.
# Lokalt kjører pdfgen og pdfgenrs i parallell (skygge-kall), så responsen er
# multipart med to PDF-er: pdfgen først, pdfgenrs som nummer to. Enkel
# application/pdf-respons håndteres også. Skriver ut filstiene som lagres.
post_og_lagre_pdfer() {
    if [[ $# -ne 3 ]]; then
        fail "post_og_lagre_pdfer krever PATH, BODY og NAVN."
    fi
    local path="$1"
    local body="$2"
    local navn="$3"

    mkdir -p "$PDF_UT_DIR"
    local headerfil bodyfil
    headerfil="$(mktemp)"
    bodyfil="$(mktemp)"

    local http_status
    http_status="$(
        curl -sS -X POST "${BASE_URL}${path}" \
            -H "Authorization: Bearer ${TOKEN_SAKSBEHANDLER}" \
            -H "Content-Type: application/json" \
            --data "$body" \
            -D "$headerfil" -o "$bodyfil" -w '%{http_code}'
    )"
    if [[ ! "$http_status" =~ ^2[0-9][0-9]$ ]]; then
        local feilmelding
        feilmelding="$(cat "$bodyfil")"
        rm -f "$headerfil" "$bodyfil"
        fail "Forhåndsvisning feilet (HTTP ${http_status}): ${feilmelding}"
    fi

    local content_type
    content_type="$(grep -i '^content-type:' "$headerfil" | tail -1 | tr -d '\r')"

    if [[ "$content_type" == *multipart* ]]; then
        python3 - "$bodyfil" "$content_type" "$PDF_UT_DIR" "$navn" <<'PY'
import re
import sys

bodyfil, content_type, ut_dir, navn = sys.argv[1:5]

match = re.search(r'boundary="?([^";]+)"?', content_type)
if not match:
    print(f"Fant ikke boundary i content-type: {content_type}", file=sys.stderr)
    sys.exit(1)
boundary = match.group(1).encode()

with open(bodyfil, "rb") as f:
    data = f.read()

suffixes = ["pdfgen", "pdfgenrs"]
index = 0
for raw in data.split(b"--" + boundary)[1:]:
    if raw.startswith(b"--"):
        break
    part = raw[2:] if raw.startswith(b"\r\n") else raw
    _, sep, body = part.partition(b"\r\n\r\n")
    if not sep:
        continue
    if body.endswith(b"\r\n"):
        body = body[:-2]
    suffix = suffixes[index] if index < len(suffixes) else str(index + 1)
    path = f"{ut_dir}/{navn}-{suffix}.pdf"
    with open(path, "wb") as f:
        f.write(body)
    print(path)
    index += 1

if index == 0:
    print("Fant ingen PDF-deler i multipart-responsen.", file=sys.stderr)
    sys.exit(1)
PY
        rm -f "$headerfil" "$bodyfil"
    else
        local utfil="${PDF_UT_DIR}/${navn}.pdf"
        mv "$bodyfil" "$utfil"
        rm -f "$headerfil"
        printf '%s\n' "$utfil"
    fi
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
