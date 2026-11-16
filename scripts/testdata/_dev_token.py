"""Hjelpefil for _lib.sh og dev-token.sh; kjør ./dev-token.sh for å lagre et token.

Leser OBO-tokens for sb-api i dev fra .dev-tokens/ og velger token etter rolle.

  beskriv FIL                       skriver «NAVident roller HH:MM», eller feiler med grunnen
  velg MAPPE ROLLE [UNNTATT_IDENT]  skriver stien til et gyldig token med rollen, fra en annen ident enn UNNTATT_IDENT
"""
import base64, json, sys, time
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

# Kopiert fra tiltakspenger-saksbehandling-api/.nais/vars/dev.yml.
ROLLER = {
    "1b3a2c4d-d620-4fcf-a29b-a6cdadf29680": "saksbehandler",
    "79985315-b2de-40b8-a740-9510796993c6": "beslutter",
    "8e07be64-c44a-4730-8053-3910ff4e3e92": "utvikler",
    "13d39d54-4af9-44a8-a57c-e223df62ab86": "veileder",
    "bdfbab87-3016-4341-97ca-8053ff1e3962": "tilbakekreving",
}


def les(fil):
    """Gir (ident, roller, utløp) for et gyldig token, ellers ValueError med grunnen."""
    try:
        del_ = Path(fil).read_text().strip().split(".")[1]
        c = json.loads(base64.urlsafe_b64decode(del_ + "=" * (-len(del_) % 4)))
    except Exception:
        raise ValueError("ikke et JWT")
    utløp = datetime.fromtimestamp(c.get("exp", 0), ZoneInfo("Europe/Oslo")).strftime("%H:%M")
    if c.get("exp", 0) < time.time() + 60:
        raise ValueError("utløpt " + utløp)
    return c.get("NAVident", "ukjent"), [ROLLER[g] for g in c.get("groups", []) if g in ROLLER], utløp


def main(kommando=None, *args):
    if kommando == "beskriv" and args:
        try:
            ident, roller, utløp = les(args[0])
        except ValueError as e:
            sys.exit(str(e))
        print(ident, ",".join(roller) or "ingen", utløp)
    elif kommando == "velg" and len(args) >= 2:
        mappe, rolle, unntatt = args[0], args[1], (args[2:] or [""])[0]
        kandidater = []
        for fil in sorted(Path(mappe).glob("dev-token-*")):
            try:
                ident, roller, _ = les(fil)
            except ValueError:
                continue
            if rolle in roller and ident != unntatt:
                # Færrest roller først, så en ident som også er beslutter blir spart til beslutter-steget.
                kandidater.append((len(roller), str(fil)))
        if not kandidater:
            sys.exit(1)
        print(min(kandidater)[1])
    else:
        sys.exit(__doc__)


if __name__ == "__main__":
    main(*sys.argv[1:])
