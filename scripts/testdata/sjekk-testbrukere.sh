#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MILJO=dev
# shellcheck source=./_lib.sh
source "${SCRIPT_DIR}/_lib.sh"

TESTBRUKERE="${TESTBRUKERE:-${SCRIPT_DIR}/.dev-testbrukere.json}"

usage() {
    echo "Bruk: $(basename "$0")" >&2
    echo "Slår opp hver bruker i ${TESTBRUKERE} i dev:" >&2
    echo "  tiltak som gir rett på tiltakspenger (GET /tiltak i soknad-api, som bruker) og sak (POST /sak i sb-api)." >&2
    echo "Resultatet lagres under «sjekk» per bruker i fila." >&2
    echo "Skriver én linje per bruker med søkbare tiltak: FNR SAKSNUMMER|- V3-KLAR NAVN | TILTAK FRA–TIL ..." >&2
    echo "V3-KLAR er ja når brukeren ikke har sak (ny sak får V3), og et tiltak startet minst 28 dager tilbake og varer forbi kravfristen" >&2
    echo "(første dag i måneden for tre måneder siden, se InnvilgbarSøknad i sb-api)." >&2
    exit 1
}

[[ "${1:-}" != "-h" && "${1:-}" != "--help" ]] || usage
[[ -f $TESTBRUKERE ]] || fail "Fant ikke ${TESTBRUKERE}. Den lages fra Confluence-sidene med testbrukere, se README."
require_server

SOKNAD_API_URL="${SOKNAD_API_URL:-https://tiltakspenger-soknad-api.intern.dev.nav.no}"
export TESTBRUKERE SOKNAD_API_URL

python3 - <<'PY'
import datetime, json, os, re, sys, urllib.error, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor

fil = os.environ["TESTBRUKERE"]
sb_api, soknad_api = os.environ["BASE_URL"], os.environ["SOKNAD_API_URL"]
sb_token = os.environ["TOKEN_SAKSBEHANDLER"]
idag = datetime.date.today()

def kall(url, data=None, headers=None):
    for forsøk in range(2):
        req = urllib.request.Request(url, data=data, headers=headers or {})
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.status, r.read().decode()
        except urllib.error.HTTPError as e:
            return e.code, e.read().decode(errors="replace")
        except OSError as e:
            feil = f"nettverk ({e.__class__.__name__})"
    return feil, ""

def sjekk(bruker):
    fnr = bruker["fnr"]
    if not re.fullmatch(r"\d{2}[4-9]\d{8}", fnr):
        return {"feil": "ikke syntetisk fnr"}
    status, borgertoken = kall(
        "https://tokenx-token-generator.intern.dev.nav.no/api/public/obo",
        urllib.parse.urlencode({"aud": "dev-gcp:tpts:tiltakspenger-soknad-api", "pid": fnr}).encode(),
    )
    if status != 200:
        return {"feil": f"tokenx {status}"}
    status, tekst = kall(f"{soknad_api}/tiltak", headers={"Authorization": f"Bearer {borgertoken.strip()}"})
    if status != 200:
        return {"feil": f"GET /tiltak {status}"}
    tiltak = [
        {
            "typeNavn": t.get("typeNavn"),
            "type": t.get("type"),
            "fra": (t.get("arenaRegistrertPeriode") or {}).get("fra"),
            "til": (t.get("arenaRegistrertPeriode") or {}).get("til"),
            "harSøkt": t.get("tidligereSøknad") is not None,
        }
        for t in json.loads(tekst).get("tiltak", [])
    ]
    status, tekst = kall(
        f"{sb_api}/sak",
        json.dumps({"fnr": fnr}).encode(),
        {"Authorization": f"Bearer {sb_token}", "Content-Type": "application/json"},
    )
    if status not in (200, 404):
        return {"feil": f"POST /sak {status}", "tiltak": tiltak}
    saksnummer = json.loads(tekst).get("saksnummer") if status == 200 else None
    return {"tiltak": tiltak, "saksnummer": saksnummer}

data = json.load(open(fil))
brukere = data["brukere"]
with ThreadPoolExecutor(8) as pool:
    resultater = list(pool.map(sjekk, brukere))

tidspunkt = datetime.datetime.now().isoformat(timespec="seconds")
for bruker, resultat in zip(brukere, resultater):
    bruker["sjekk"] = {"tidspunkt": tidspunkt, **resultat}
tmp = fil + ".tmp"
with open(os.open(tmp, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600), "w") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
os.replace(tmp, fil)

kravfrist = (idag.replace(day=1) - datetime.timedelta(days=1)).replace(day=1)
kravfrist = (kravfrist - datetime.timedelta(days=1)).replace(day=1)
kravfrist = (kravfrist - datetime.timedelta(days=1)).replace(day=1)

def gir_meldekort(t):
    return (t["fra"] and t["til"] and datetime.date.fromisoformat(t["fra"]) <= idag - datetime.timedelta(days=28)
            and datetime.date.fromisoformat(t["til"]) >= kravfrist)

feil = [r["feil"] for r in resultater if "feil" in r]
med_tiltak = 0
for bruker, r in zip(brukere, resultater):
    if not r.get("tiltak"):
        continue
    med_tiltak += 1
    v3 = "ja" if r.get("saksnummer") is None and "feil" not in r and any(gir_meldekort(t) for t in r["tiltak"]) else "nei"
    tiltak = "; ".join(f"{t['typeNavn']} {t['fra']}–{t['til']}{' (søkt)' if t['harSøkt'] else ''}" for t in r["tiltak"])
    print(bruker["fnr"], r.get("saksnummer") or "-", v3, bruker.get("navn") or "-", "|", tiltak)
print(f"[sjekk-testbrukere.sh] {len(brukere)} brukere, {med_tiltak} med søkbare tiltak, {len(feil)} feil"
      + (f": {sorted(set(feil))}" if feil else "") + f". Lagret i {fil}", file=sys.stderr)
PY
