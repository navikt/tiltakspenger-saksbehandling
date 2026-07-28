#!/usr/bin/env python3
"""Delt driver for meldekortflyten mot LokalMain, brukt av fyll-og-iverksett-meldekort.sh og opprett-meldekort-korrigering.sh.

Bruk:
  _meldekort_flyt.py iverksett SAKSNUMMER [DATO=STATUS ...]
  _meldekort_flyt.py korriger SAKSNUMMER [DATO=STATUS ...]

`iverksett` oppretter behandling på første kjede, fyller ut, sender til beslutning, tar (som beslutter) og iverksetter.
`korriger` oppretter en ny behandling på samme kjede, fyller ut og lar den stå åpen, slik at simuleringen kan ses i behandlingsbildet.
`kjede=N` blant argumentene velger meldeperiodekjede N (0-basert, default 0).

Dager uten override fylles slik: girRett + hverdag -> DELTATT_UTEN_LØNN_I_TILTAKET, helg -> IKKE_TILTAKSDAG, ellers IKKE_RETT_TIL_TILTAKSPENGER.
Statusverdier er MeldekortDagStatusDTO fra saksbehandling-api, f.eks. FRAVÆR_ANNET.

BASE_URL, TOKEN_SAKSBEHANDLER og TOKEN_BESLUTTER kan overstyres med miljøvariabler og har samme defaults som _lib.sh.
"""

import json
import os
import sys
import urllib.parse
import urllib.request
from datetime import date, timedelta

BASE = os.environ.get("BASE_URL", "http://localhost:8080")
TOKEN_SAKSBEHANDLER = os.environ.get("TOKEN_SAKSBEHANDLER", "TokenMcTokenface")
TOKEN_BESLUTTER = os.environ.get("TOKEN_BESLUTTER", "TokenMcTokenface2")


def kall(metode, sti, token, body=None, tillatt_kode=None):
    req = urllib.request.Request(
        BASE + sti,
        method=metode,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        data=json.dumps(body).encode() if body is not None else None,
    )
    try:
        with urllib.request.urlopen(req) as res:
            tekst = res.read().decode()
            return json.loads(tekst) if tekst else None
    except urllib.error.HTTPError as e:
        kropp = e.read().decode()
        if tillatt_kode and tillatt_kode in kropp:
            return None
        print(f"FEIL {metode} {sti} -> {e.code}: {kropp[:500]}", file=sys.stderr)
        sys.exit(1)


def dager_for_kjede(kjede, overrides):
    """Én status per dag i meldeperioden, med overrides der de er gitt."""
    gir_rett = kjede["sisteMeldeperiode"]["girRett"]
    fom = date.fromisoformat(kjede["periode"]["fraOgMed"])
    tom = date.fromisoformat(kjede["periode"]["tilOgMed"])
    dager = []
    d = fom
    while d <= tom:
        iso = d.isoformat()
        if iso in overrides:
            status = overrides[iso]
        elif not gir_rett.get(iso, False):
            status = "IKKE_RETT_TIL_TILTAKSPENGER"
        elif d.weekday() >= 5:
            status = "IKKE_TILTAKSDAG"
        else:
            status = "DELTATT_UTEN_LØNN_I_TILTAKET"
        dager.append({"dato": iso, "status": status})
        d += timedelta(days=1)
    ukjente = set(overrides) - {dag["dato"] for dag in dager}
    if ukjente:
        print(f"FEIL: override-datoer utenfor meldeperioden {fom}..{tom}: {sorted(ukjente)}", file=sys.stderr)
        sys.exit(1)
    return dager


def main():
    if len(sys.argv) < 3 or sys.argv[1] not in ("iverksett", "korriger"):
        print(__doc__, file=sys.stderr)
        sys.exit(1)
    modus, saksnummer = sys.argv[1], sys.argv[2]
    argumenter = dict(arg.split("=", 1) for arg in sys.argv[3:])
    kjedeindeks = int(argumenter.pop("kjede", "0"))
    overrides = argumenter

    sak = kall("GET", f"/sak/{saksnummer}", TOKEN_SAKSBEHANDLER)
    sak_id = sak["sakId"]
    kjede_id = sak["meldeperiodeKjeder"][kjedeindeks]["id"]
    kjede_id_encoded = urllib.parse.quote(kjede_id, safe="")

    kall(
        "POST", f"/sak/{sak_id}/meldeperiode/{kjede_id_encoded}/opprettBehandling",
        TOKEN_SAKSBEHANDLER, {"v2": False}, tillatt_kode="HAR_ÅPEN_BEHANDLING",
    )
    sak = kall("GET", f"/sak/{saksnummer}", TOKEN_SAKSBEHANDLER)
    kjede = sak["meldeperiodeKjeder"][kjedeindeks]
    åpne = [b for b in kjede["meldekortbehandlinger"] if b["status"] == "UNDER_BEHANDLING"]
    if not åpne:
        ferdige = [b for b in kjede["meldekortbehandlinger"] if b["status"] in ("GODKJENT", "AUTOMATISK_BEHANDLET")]
        if modus == "iverksett" and ferdige:
            # Kjeden er allerede iverksatt fra en tidligere kjøring -- ingenting å gjøre.
            print(ferdige[-1]["id"])
            return
        print("FEIL: fant ingen åpen meldekortbehandling etter opprettelse.", file=sys.stderr)
        sys.exit(1)
    meldekort_id = åpne[-1]["id"]

    kall(
        "POST", f"/sak/{sak_id}/meldekort/{meldekort_id}/oppdater",
        TOKEN_SAKSBEHANDLER,
        {
            "meldeperioder": [{"kjedeId": kjede["id"], "dager": dager_for_kjede(kjede, overrides)}],
            "begrunnelse": None,
            "tekstTilVedtaksbrev": None,
            "skalSendeVedtaksbrev": False,
        },
    )

    if modus == "iverksett":
        kall("POST", f"/sak/{sak_id}/meldekort/{meldekort_id}/sendtilbeslutning", TOKEN_SAKSBEHANDLER)
        kall("POST", f"/sak/{sak_id}/meldekort/{meldekort_id}/ta", TOKEN_BESLUTTER)
        kall("POST", f"/sak/{sak_id}/meldekort/{meldekort_id}/iverksett", TOKEN_BESLUTTER)

    print(meldekort_id)


if __name__ == "__main__":
    main()
