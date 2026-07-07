#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./_lib.sh
source "${SCRIPT_DIR}/_lib.sh"

usage() {
    echo "Bruk: $(basename "$0") SAKSNUMMER [PYEXPR]" >&2
    exit 1
}

[[ $# -ge 1 && $# -le 2 ]] || usage

saksnummer="$1"
pyexpr="${2:-}"
require_server

response="$(http_saksbehandler GET "/sak/${saksnummer}")"
if [[ -z "$pyexpr" ]]; then
    printf '%s\n' "$response" | pretty_json
else
    jval "$response" "$pyexpr"
fi
