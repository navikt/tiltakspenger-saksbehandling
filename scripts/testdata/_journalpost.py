"""Finner eller oppretter journalposter for syntetiske testbrukere i dev, rett mot SAF og dokarkiv.

Tokenet er et maskintoken fra azure-token-generator, som SAF og dokarkiv i dev slipper inn uten innlogging.
Fødselsnummeret skrives aldri ut; bare journalpost-id-en går til stdout.
"""

import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
import uuid

TOKENGENERATOR = "https://azure-token-generator.intern.dev.nav.no/api/public/m2m"
SAF = "https://saf-q2.dev-fss-pub.nais.io/graphql"
DOKARKIV = "https://dokarkiv-q2.dev-fss-pub.nais.io/rest/journalpostapi/v1/journalpost"

# Samme tittel og brevkode som søknad-api bruker, så journalposten ser ut som en søknad i Gosys og SAF.
SØKNADSTITTEL = "Søknad om tiltakspenger"
SØKNADSBREVKODE = "NAV 76-13.45"


def logg(tekst):
    print(f"[journalpost] {tekst}", file=sys.stderr)


def stopp(tekst):
    logg(f"FEIL: {tekst}")
    sys.exit(1)


def krev_syntetisk_fnr(fnr):
    # Samme regel som krev_syntetisk_fnr i _lib.sh.
    if not re.fullmatch(r"\d{2}[4-9]\d{8}", fnr):
        stopp("Fødselsnummeret er ikke i den syntetiske serien (4–9 som tredje siffer).")


def maskintoken(aud):
    data = urllib.parse.urlencode({"aud": aud}).encode()
    with urllib.request.urlopen(urllib.request.Request(TOKENGENERATOR, data=data), timeout=30) as svar:
        return svar.read().decode().strip()


def post_json(url, token, body):
    forespørsel = urllib.request.Request(
        url,
        data=json.dumps(body).encode(),
        method="POST",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Nav-Callid": f"testdata-{uuid.uuid4()}",
        },
    )
    try:
        with urllib.request.urlopen(forespørsel, timeout=60) as svar:
            return json.loads(svar.read())
    except urllib.error.HTTPError as feil:
        stopp(f"{url} svarte {feil.code}: {feil.read().decode()[:500]}")


def journalposter_for(fnr):
    spørring = """
    query($id: String!) {
      dokumentoversiktBruker(brukerId: {id: $id, type: FNR}, foerste: 100) {
        journalposter { journalpostId datoOpprettet journalstatus tema tittel }
      }
    }
    """
    svar = post_json(SAF, maskintoken("dev-fss:teamdokumenthandtering:saf"), {"query": spørring, "variables": {"id": fnr}})
    if svar.get("errors"):
        stopp(f"SAF svarte med feil: {[f.get('message') for f in svar['errors']]}")
    return svar["data"]["dokumentoversiktBruker"]["journalposter"]


def finn(fnr):
    # sb-api krever bare at journalposten finnes, har opprettelsesdato og gjelder brukeren.
    # Søknader med tema IND foretrekkes, og ellers tas den nyeste.
    kandidater = [jp for jp in journalposter_for(fnr) if jp.get("datoOpprettet") and jp.get("journalstatus") != "UTGAAR"]
    if not kandidater:
        stopp("Brukeren har ingen brukbare journalposter i SAF. Lag en med opprett-journalpost.sh.")
    kandidater.sort(
        key=lambda jp: (jp.get("tema") == "IND" and "søknad" in (jp.get("tittel") or "").lower(), jp["datoOpprettet"]),
        reverse=True,
    )
    valgt = kandidater[0]
    logg(f"Fant {len(kandidater)} journalposter; valgte {valgt['journalpostId']} ({valgt['tema']}, {valgt['tittel']}, {valgt['datoOpprettet']}).")
    print(valgt["journalpostId"])


def minimal_pdf(tekst):
    innhold = f"BT /F1 18 Tf 72 720 Td ({tekst}) Tj ET".encode("latin-1")
    objekter = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
        b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
        b"<< /Length %d >>\nstream\n" % len(innhold) + innhold + b"\nendstream",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    ]
    pdf = bytearray(b"%PDF-1.4\n")
    posisjoner = []
    for nummer, objekt in enumerate(objekter, start=1):
        posisjoner.append(len(pdf))
        pdf += b"%d 0 obj\n" % nummer + objekt + b"\nendobj\n"
    xref = len(pdf)
    pdf += b"xref\n0 %d\n0000000000 65535 f \n" % (len(objekter) + 1)
    for posisjon in posisjoner:
        pdf += b"%010d 00000 n \n" % posisjon
    pdf += b"trailer\n<< /Size %d /Root 1 0 R >>\nstartxref\n%d\n%%%%EOF\n" % (len(objekter) + 1, xref)
    return bytes(pdf)


def opprett(fnr):
    import base64

    pdf = base64.b64encode(minimal_pdf("Testsoknad om tiltakspenger fra testdata-scriptene")).decode()
    body = {
        "tittel": SØKNADSTITTEL,
        "journalpostType": "INNGAAENDE",
        "tema": "IND",
        # Skannet papir, som en papirsøknad.
        "kanal": "SKAN_IM",
        "avsenderMottaker": {"id": fnr, "idType": "FNR"},
        "bruker": {"id": fnr, "idType": "FNR"},
        "eksternReferanseId": f"tiltakspenger-testdata-{uuid.uuid4()}",
        "dokumenter": [
            {
                "tittel": SØKNADSTITTEL,
                "brevkode": SØKNADSBREVKODE,
                "dokumentvarianter": [{"filtype": "PDFA", "variantformat": "ARKIV", "filnavn": "testsoknad.pdf", "fysiskDokument": pdf}],
            }
        ],
    }
    svar = post_json(f"{DOKARKIV}?forsoekFerdigstill=false", maskintoken("dev-fss:teamdokumenthandtering:dokarkiv"), body)
    # Journalposten vises i oversikten i SAF først når tiltakspenger-journalposthendelser har journalført den, etter noen sekunder.
    logg(f"Opprettet journalpost {svar['journalpostId']}.")
    print(svar["journalpostId"])


if __name__ == "__main__":
    if len(sys.argv) != 3 or sys.argv[1] not in ("finn", "opprett"):
        stopp("Bruk: _journalpost.py finn|opprett FNR")
    krev_syntetisk_fnr(sys.argv[2])
    {"finn": finn, "opprett": opprett}[sys.argv[1]](sys.argv[2])
