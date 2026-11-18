#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MILJO=dev
# shellcheck source=./_lib.sh
source "${SCRIPT_DIR}/_lib.sh"

usage() {
    echo "Bruk: $(basename "$0") FNR [TILTAKSINDEKS]" >&2
    echo "Sender en digital søknad uten barn og andre ytelser til soknad-api i dev, som brukeren selv." >&2
    echo "Søknaden gjelder hele det registrerte tiltaket med indeks TILTAKSINDEKS (default 0) fra GET /tiltak." >&2
    echo "Venter til søknaden er kommet fram til sb-api og skriver SAKSNUMMER=<saksnummer>." >&2
    exit 1
}

[[ $# -ge 1 && $# -le 2 ]] || usage
fnr="$1"
tiltaksindeks="${2:-0}"
krev_syntetisk_fnr "$fnr"
require_server

borgertoken="$(borgertoken_dev "$fnr")"
tiltak_json="$(hent_tiltak_dev "$fnr")"

soknad_json="$(python3 - "$tiltak_json" "$tiltaksindeks" <<'PY'
import json, sys
tiltak = json.loads(sys.argv[1]).get("tiltak", [])
indeks = int(sys.argv[2])
if indeks >= len(tiltak):
    print(f"Brukeren har {len(tiltak)} tiltak som gir rett, fant ikke indeks {indeks}.", file=sys.stderr)
    sys.exit(1)
t = tiltak[indeks]
periode = t.get("arenaRegistrertPeriode") or {}
if not periode.get("fra") or not periode.get("til"):
    print("Tiltaket mangler fra- eller til-dato og kan ikke søkes på fra scriptet.", file=sys.stderr)
    sys.exit(1)
nei = {"deltar": False, "periode": None}
print(json.dumps({
    "kvalifiseringsprogram": nei,
    "introduksjonsprogram": nei,
    "institusjonsopphold": {"borPåInstitusjon": False, "periode": None},
    "tiltak": {
        "aktivitetId": t["aktivitetId"],
        "periode": {"fra": periode["fra"], "til": periode["til"]},
        "arenaRegistrertPeriode": periode,
        "arrangør": t.get("arrangør") or "",
        "type": t["type"],
        "typeNavn": t["typeNavn"],
        "gjennomforingId": t.get("gjennomforingId"),
        "visningsnavn": t.get("visningsnavn"),
    },
    "barnetillegg": {
        "manueltRegistrerteBarnSøktBarnetilleggFor": [],
        "registrerteBarnSøktBarnetilleggFor": [],
        "søkerOmBarnetillegg": False,
    },
    "mottarAndreUtbetalinger": False,
    "sykepenger": {"mottar": False, "periode": None},
    "gjenlevendepensjon": {"mottar": False, "periode": None},
    "alderspensjon": {"mottar": False, "fraDato": None},
    "supplerendestønadover67": {"mottar": False, "periode": None},
    "supplerendestønadflyktninger": {"mottar": False, "periode": None},
    "pensjonsordning": {"mottar": False, "periode": None},
    "etterlønn": {"mottar": False},
    "jobbsjansen": {"mottar": False, "periode": None},
    "harBekreftetAlleOpplysninger": True,
    "harBekreftetÅSvareSåGodtManKan": True,
}, ensure_ascii=False))
PY
)" || fail "Kunne ikke lage søknaden."

sak_json="$(http_saksbehandler PUT /sak "{\"fnr\":\"${fnr}\"}")" ||
    fail "PUT /sak feilet. Ved 403 mangler saksbehandleren tilgang til personen, for eksempel fordi geografisk tilknytning eller PDL-data mangler; gjenopprett brukeren i Dolly."
saksnummer="$(jval "$sak_json" "saksnummer")"
antall_søknader() {
    python3 -c 'import json, sys; print(len(json.load(sys.stdin)["søknader"]))' <<<"$(http_saksbehandler GET "/sak/${saksnummer}")"
}
antall_for="$(antall_søknader)"

soknad_fil="$(mktemp)"
trap 'rm -f "$soknad_fil"' EXIT
printf '%s' "$soknad_json" >"$soknad_fil"
curl -sSf -X POST -H "Authorization: Bearer ${borgertoken}" \
    -F "søknad=<${soknad_fil};type=application/json" "${SOKNAD_API_URL}/soknad" >/dev/null ||
    fail "POST /soknad feilet i soknad-api."
log "Søknaden er sendt. Venter på journalføring og mottak i sb-api (kan ta noen minutter)."

for _ in $(seq 1 60); do
    antall="$(antall_søknader)"
    if ((antall > antall_for)); then
        printf 'SAKSNUMMER=%s\n' "$saksnummer"
        exit 0
    fi
    sleep 10
done
fail "Søknaden kom ikke fram til sak ${saksnummer} innen 10 minutter."
