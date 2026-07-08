#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./_lib.sh
source "${SCRIPT_DIR}/_lib.sh"

usage() {
    echo "Bruk: $(basename "$0") SAK_ID TYPE [RAMMEVEDTAK_ID]" >&2
    echo "  TYPE: STANS | REVURDERING_INNVILGELSE | OMGJØRING" >&2
    echo "  RAMMEVEDTAK_ID er påkrevd for OMGJØRING (vedtaket som omgjøres)." >&2
    exit 1
}

[[ $# -ge 2 && $# -le 3 ]] || usage

sak_id="$1"
revurdering_type="$2"
rammevedtak_id="${3:-}"
require_server

case "$revurdering_type" in
STANS | REVURDERING_INNVILGELSE) ;;
OMGJØRING)
    [[ -n "$rammevedtak_id" ]] || usage
    ;;
*) usage ;;
esac

if [[ -n "$rammevedtak_id" ]]; then
    body="{\"revurderingType\":\"${revurdering_type}\",\"rammevedtakIdSomOmgjøres\":\"${rammevedtak_id}\"}"
else
    body="{\"revurderingType\":\"${revurdering_type}\"}"
fi

response="$(http_saksbehandler POST "/sak/${sak_id}/revurdering/start" "$body")"
behandling_id="$(jval "$response" "id")"
[[ -n "$behandling_id" ]] || fail "Mangler behandlingId i responsen."

intern_deltakelse_id="$(jval "$response" "saksopplysninger.tiltaksdeltagelse[0].internDeltakelseId" 2>/dev/null || true)"
if [[ -n "$intern_deltakelse_id" && "$intern_deltakelse_id" != "null" ]]; then
    printf '%s %s\n' "$behandling_id" "$intern_deltakelse_id"
else
    printf '%s\n' "$behandling_id"
fi
