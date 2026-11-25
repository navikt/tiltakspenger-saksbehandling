#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export MILJO=dev
# shellcheck source=./_lib.sh
source "${SCRIPT_DIR}/_lib.sh"

PARALLELLITET="${PARALLELLITET:-5}"

usage() {
    echo "Bruk: $(basename "$0") SAKSNUMMER ... eller saksnumre på stdin" >&2
    echo "Migrerer V2-saker parallelt, opphever sperren straks og iverksetter et meldekort etter OK fra Hel Ved." >&2
    echo "PARALLELLITET styrer antall samtidige migreringer og er 5 som standard." >&2
    exit 1
}

arbeid_sak() {
    local saksnummer="$1"
    local sakssvar sakstatus sakjson sakid migreringssvar migreringsstatus migreringsjson tidspunkt alleredeMigrert

    sakssvar="$(curl -sS -H "Authorization: Bearer ${TOKEN_SAKSBEHANDLER}" \
        -w $'\n%{http_code}' "${BASE_URL}/sak/${saksnummer}")" || true
    sakstatus="${sakssvar##*$'\n'}"
    sakjson="${sakssvar%$'\n'*}"
    if [[ "$sakstatus" != "200" ]]; then
        tidspunkt="$(date '+%Y-%m-%dT%H:%M:%S%z')"
        printf '%s\t%s\t%s\n' "$saksnummer" "$sakstatus" "$tidspunkt"
        log "Sak ${saksnummer}: oppslag feilet med HTTP ${sakstatus}; migreringen ble ikke kalt."
        return 0
    fi

    if ! sakid="$(jval "$sakjson" "sakId")"; then
        tidspunkt="$(date '+%Y-%m-%dT%H:%M:%S%z')"
        printf '%s\tUGYLDIG_SVAR\t%s\n' "$saksnummer" "$tidspunkt"
        log "Sak ${saksnummer}: fant ikke sakId i svaret; migreringen ble ikke kalt."
        return 0
    fi

    migreringssvar="$(curl -sS -X POST \
        -H "Authorization: Bearer ${TOKEN_SAKSBEHANDLER}" \
        -w $'\n%{http_code}' \
        "${BASE_URL}/sak/${sakid}/migrer-til-oppdragsversjon-3?opphevSperrenStraks=true")" || true
    migreringsstatus="${migreringssvar##*$'\n'}"
    migreringsjson="${migreringssvar%$'\n'*}"
    tidspunkt="$(date '+%Y-%m-%dT%H:%M:%S%z')"
    printf '%s\t%s\t%s\n' "$saksnummer" "$migreringsstatus" "$tidspunkt"

    if [[ "$migreringsstatus" != "200" ]]; then
        log "Sak ${saksnummer}: migreringen svarte HTTP ${migreringsstatus}; meldekortet ble ikke iverksatt."
        return 0
    fi
    if ! alleredeMigrert="$(jval "$migreringsjson" "alleredeMigrert")"; then
        log "Sak ${saksnummer}: kunne ikke lese migreringssvaret; meldekortet ble ikke iverksatt."
        return 0
    fi
    if [[ "$alleredeMigrert" == "true" ]]; then
        log "Sak ${saksnummer}: var allerede på V3; meldekortet ble ikke iverksatt."
        return 0
    fi
    if ! "${SCRIPT_DIR}/fyll-og-iverksett-meldekort.sh" "$saksnummer" >/dev/null; then
        log "Sak ${saksnummer}: migreringen lyktes, men meldekortet kunne ikke iverksettes."
    fi
}

if [[ "${1:-}" == "__arbeider" ]]; then
    [[ $# -eq 2 ]] || usage
    arbeid_sak "$2"
    exit 0
fi

[[ "$PARALLELLITET" =~ ^[1-9][0-9]*$ ]] || fail "PARALLELLITET må være et positivt heltall."

saksnumre=()
if [[ $# -gt 0 ]]; then
    saksnumre=("$@")
else
    while IFS= read -r saksnummer || [[ -n "$saksnummer" ]]; do
        [[ -n "$saksnummer" ]] && saksnumre+=("$saksnummer")
    done
fi

[[ ${#saksnumre[@]} -gt 0 ]] || usage
for saksnummer in "${saksnumre[@]}"; do
    [[ "$saksnummer" =~ ^[0-9]+$ ]] || fail "Ugyldig saksnummer; bare sifre er tillatt."
done

require_server
printf 'saksnummer\thttp_status\ttidspunkt\n'
printf '%s\n' "${saksnumre[@]}" |
    xargs -P "$PARALLELLITET" -I '{}' "${SCRIPT_DIR}/migrer-uten-kontrollsimulering.sh" __arbeider '{}'
