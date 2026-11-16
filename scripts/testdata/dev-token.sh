#!/usr/bin/env bash
# Lagrer og lister OBO-tokens for sb-api i dev, som scriptene leser med MILJO=dev.
# Bruk: ./dev-token.sh        åpner tokengeneratoren, leser tokenet fra utklippstavlen og lagrer det som .dev-tokens/dev-token-<NAVident> (gitignored)
#       ./dev-token.sh liste  lister lagrede tokens med ident, roller og utløpstid
# Scriptene velger selv en saksbehandler og en beslutter med en annen ident; overstyr med DEV_SAKSBEHANDLER=<ident> og DEV_BESLUTTER=<ident>.
set -euo pipefail

HER="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIR="${DEV_TOKEN_DIR:-$HER/.dev-tokens}"
# Går via /oauth2/login med prompt=select_account, så Entra spør etter konto i stedet for å gjenbruke innloggingen nettleseren har.
SB_API="https://tiltakspenger-saksbehandling-api.intern.dev.nav.no"
URL="https://azure-token-generator.intern.dev.nav.no/oauth2/login?prompt=select_account&redirect=%2Fapi%2Fobo%3Faud%3Ddev-gcp%3Atpts%3Atiltakspenger-saksbehandling-api"

beskriv() { python3 "$HER/_dev_token.py" beskriv "$1"; }

lagre() {
    local tmp="$DIR/.ny" info ident
    echo "Velg kontoen (identen) du vil legge til, og kopier tokenet." >&2
    open "$URL"
    read -r -p "Trykk Enter når tokenet er kopiert … " _ </dev/tty
    pbpaste | python3 -c 'import sys,json; t=sys.stdin.read().strip(); print(json.loads(t).get("access_token","") if t.startswith("{") else t)' >"$tmp"
    if ! info=$(beskriv "$tmp"); then
        rm -f "$tmp"
        echo "Utklippstavlen hadde ikke et gyldig token; prøv igjen." >&2
        exit 1
    fi
    # sb-api avgjør om tokenet virker; aud i tokenet er klient-ID-en, ikke appnavnet.
    local svar
    svar=$(printf 'Authorization: Bearer %s\n' "$(cat "$tmp")" | curl -sS -w '\n%{http_code}' -H @- "$SB_API/saksbehandler") || true
    if [[ ${svar##*$'\n'} != 200 ]]; then
        rm -f "$tmp"
        echo "sb-api i dev avviste tokenet (HTTP ${svar##*$'\n'}); er det laget for tiltakspenger-saksbehandling-api?" >&2
        exit 1
    fi
    echo "sb-api: $(python3 -c 'import sys,json; d=json.loads(sys.stdin.read()); print(d["navIdent"], ",".join(r if isinstance(r,str) else str(r) for r in d.get("roller",[])))' <<<"${svar%$'\n'*}")" >&2
    ident="${info%% *}"
    [[ $ident =~ ^[A-Za-z0-9]+$ ]] || { rm -f "$tmp"; echo "Tokenet mangler NAVident." >&2; exit 1; }
    mv "$tmp" "$DIR/dev-token-$ident"
    pbcopy </dev/null
    echo "Lagret $info" >&2
}

liste() {
    local fil info
    shopt -s nullglob
    for fil in "$DIR"/dev-token-*; do
        info=$(beskriv "$fil" 2>&1) || info="${fil##*/dev-token-} ($info)"
        echo "$info"
    done
}

umask 077
mkdir -p "$DIR"
case "${1:-}" in
"") lagre ;;
liste) liste ;;
*) echo "Bruk: $0 [liste]" >&2 && exit 2 ;;
esac
