# Opprette behandlinger lokalt (meldekort og klage)

Denne guiden viser hvordan du oppretter test-behandlinger i lokalt miljø slik at du
har noe konkret å teste på i frontend:

- en **søknadsbehandling** som drives helt til et **iverksatt innvilget vedtak**,
- en **meldekortbehandling**, og
- en **klagebehandling**.

Alt kan gjøres på to måter, som begge er dokumentert under:

1. **Scripts** (`curl` under panseret) — raskest for å generere testdata.
2. **GUI** — hele klikkstien fra A til Å, som speiler det scriptene gjør.

Vi dekker begge søknadsinngangene: **digital søknad** og **papirsøknad**
(manuelt registrert).

## Forutsetninger

- `LokalMain` i `tiltakspenger-saksbehandling-api` kjører på `http://localhost:8080`.
- Lokal Postgres kjører (docker). Har du Flyway-trøbbel som hindrer oppstart, se
  [Resette lokal database](#resette-lokal-database) nederst.
- Frontend (`tiltakspenger-saksbehandling`) kjører hvis du vil teste i GUI.

### Autentisering (kun relevant for curl/scripts)

`LokalMain` bruker en **fake Texas-klient**, så du trenger ingen ekte OAuth. Bruk
disse bearer-tokenene direkte:

| Bruker | navIdent | Roller | Token |
| --- | --- | --- | --- |
| Saksbehandler | `A123456` | SAKSBEHANDLER, BESLUTTER | `TokenMcTokenface` |
| Beslutter (2. bruker) | `B123456` | SAKSBEHANDLER, BESLUTTER | `TokenMcTokenface2` |

Vi bruker to forskjellige brukere fordi **4-øyne-kontroll** krever at saksbehandler
og beslutter ikke er samme person.

---

## Raskeste vei: scripts

Scriptene ligger i [`scripts/testdata/`](../scripts/testdata/) og er bygget i lag:
små byggeklosser (ett per endepunkt), mellomnivå-script som kombinerer steg, og
topp-nivå-script som kombinerer mellomnivåene. Se
[`scripts/testdata/README.md`](../scripts/testdata/README.md) for full oversikt.

**Alt på én gang** (innvilget vedtak + meldekortbehandling + klagebehandling):

```bash
# digital søknad som inngang
./scripts/testdata/opprett-alt-digital.sh

# papirsøknad (manuelt registrert) som inngang
./scripts/testdata/opprett-alt-papir.sh
```

Begge skriver ut et **saksnummer** til slutt — søk det opp i frontend for å teste.

### Script-lagene

**Byggeklosser (ett endepunkt hver):**

| Script | Gjør |
| --- | --- |
| `seed-digital-soknad.sh [FNR]` | `POST /dev/soknad/ny` — lager sak + digital søknad |
| `hent-eller-opprett-sak.sh FNR` | `PUT /sak` — lager tom sak (brukes av papir) |
| `registrer-papir-soknad.sh SAKSNUMMER [TYPE]` | `POST /sak/{saksnummer}/soknad` — registrerer papirsøknad + starter behandling |
| `hent-sak.sh SAKSNUMMER [uttrykk]` | `GET /sak/{saksnummer}` |
| `start-soknadsbehandling.sh SAK_ID SOKNAD_ID` | `POST .../ny-behandling` (digital) |
| `oppdater-innvilgelse.sh SAK_ID BEH_ID INTERN_DELTAKELSE_ID` | `POST .../oppdater` (INNVILGELSE) |
| `send-til-beslutning.sh SAK_ID BEH_ID` | `POST .../sendtilbeslutning` |
| `ta-behandling.sh SAK_ID BEH_ID` | `POST .../ta` (som beslutter) |
| `iverksett.sh SAK_ID BEH_ID` | `POST .../iverksett` (som beslutter) |
| `opprett-meldekortbehandling.sh SAK_ID KJEDE_ID` | `POST .../meldeperiode/{kjede}/opprettBehandling` |
| `opprett-klage.sh SAK_ID` | `POST /sak/{sakId}/klage` |

**Mellomnivå (kombinerer steg):**

| Script | Gjør |
| --- | --- |
| `innvilg-og-iverksett.sh SAK_ID BEH_ID INTERN_DELTAKELSE_ID` | oppdater → send til beslutning → ta → iverksett |
| `opprett-innvilget-sak-digital.sh [FNR]` | digital seed → start behandling → innvilg og iverksett |
| `opprett-innvilget-sak-papir.sh [FNR]` | tom sak → papirsøknad → innvilg og iverksett |

**Topp-nivå (kombinerer mellomnivåene):**

| Script | Gjør |
| --- | --- |
| `opprett-alt-digital.sh` | innvilget sak (digital) + meldekortbehandling + klage |
| `opprett-alt-papir.sh` | innvilget sak (papir) + meldekortbehandling + klage |

---

## Slik henger det sammen (bakgrunn)

- En **meldekortbehandling** krever at saken har et **iverksatt, innvilget
  rammevedtak** — det er vedtaket som genererer `meldeperiodeKjeder`. Derfor må vi
  alltid kjøre en søknadsbehandling helt til iverksettelse først.
- En **klagebehandling** kan opprettes rett på saken, uten vedtak først.
- Forskjellen på digital og papir er kun **hvordan søknaden kommer inn**:
  - **Digital:** dev-routen `POST /dev/soknad/ny` lager sak + søknad. Deretter starter
    du behandlingen med et eget `ny-behandling`-kall.
  - **Papir:** du lager først en (tom) sak med `PUT /sak`, og registrerer så
    papirsøknaden med `POST /sak/{saksnummer}/soknad`. Dette kallet både registrerer
    søknaden **og** starter søknadsbehandlingen i ett steg (ingen egen
    `ny-behandling`).
  - Papir bruker fnr `12345678911`, fordi den lokale SAF-faken knytter journalpost
    `12345` til nettopp dette fødselsnummeret (journalpost-valideringen krever at
    journalposten tilhører sakens person).

---

## Manuell curl (uten scripts)

Standardperioden for tiltak/vedtak er `2025-04-01`–`2025-04-10`.

### Felles behandlingssteg

Når du har `SAK_ID`, `BEH_ID` og `INTERN_DELTAKELSE_ID` er resten likt for digital og
papir:

```bash
T1="Authorization: Bearer TokenMcTokenface"
T2="Authorization: Bearer TokenMcTokenface2"
CT="Content-Type: application/json"
B=http://localhost:8080

# 1) Innvilg
curl -sf -X POST "$B/sak/$SAK_ID/behandling/$BEH_ID/oppdater" -H "$T1" -H "$CT" -d "{
  \"resultat\":\"INNVILGELSE\",
  \"begrunnelseVilkårsvurdering\":\"test\",
  \"fritekstTilVedtaksbrev\":\"test\",
  \"innvilgelsesperioder\":[{\"periode\":{\"fraOgMed\":\"2025-04-01\",\"tilOgMed\":\"2025-04-10\"},\"antallDagerPerMeldeperiode\":10,\"internDeltakelseId\":\"$INTERN_DELTAKELSE_ID\"}],
  \"barnetillegg\":{\"begrunnelse\":null,\"perioder\":[]},
  \"skalSendeVedtaksbrev\":true
}"

# 2) Send til beslutning (saksbehandler)
curl -sf -X POST "$B/sak/$SAK_ID/behandling/$BEH_ID/sendtilbeslutning" -H "$T1" -H "$CT"

# 3) Beslutter tar behandlingen (annen bruker – 4-øyne)
curl -sf -X POST "$B/sak/$SAK_ID/behandling/$BEH_ID/ta" -H "$T2" -H "$CT"

# 4) Iverksett (beslutter)
curl -sf -X POST "$B/sak/$SAK_ID/behandling/$BEH_ID/iverksett" -H "$T2" -H "$CT"
```

Etter iverksettelse: hent saken, finn `meldeperiodeKjeder[0].id` (kjedeId, f.eks.
`2025-03-31/2025-04-13`), og opprett meldekortbehandlingen. `kjedeId` inneholder `/`
og **må URL-encodes** (`%2F`), ellers får du 404:

```bash
curl -sf -X POST "$B/sak/$SAK_ID/meldeperiode/2025-03-31%2F2025-04-13/opprettBehandling" \
  -H "$T1" -H "$CT" -d '{"v2":false}'
```

Klage (kan gjøres når som helst på saken):

```bash
curl -sf -X POST "$B/sak/$SAK_ID/klage" -H "$T1" -H "$CT" -d '{
  "journalpostId":"12345","vedtakDetKlagesPå":null,"erKlagerPartISaken":true,
  "klagesDetPåKonkreteElementerIVedtaket":true,"erKlagefristenOverholdt":true,
  "erUnntakForKlagefrist":null,"erKlagenSignert":true,"innsendingsdato":"2025-04-15",
  "innsendingskilde":"DIGITAL"}'
```

> **journalpostId:** Den lokale SAF-faken kjenner kun `"12345"` (bruker fnr
> `12345678911`) og `"123456"` (tilfeldig fnr). Bruk `"12345"`.

### Digital inngang (curl)

```bash
# Lag sak + digital søknad
SAKSNR=$(curl -s -X POST "$B/dev/soknad/ny" -H "$CT" -d '{"barnetillegg":[]}')
# Hent sakId + søknadId
curl -s "$B/sak/$SAKSNR" -H "$T1" | python3 -m json.tool   # -> .sakId og .søknader[0].id
# Start behandlingen (gir deg behandlingId + saksopplysninger.tiltaksdeltagelse[0].internDeltakelseId)
curl -s -X POST "$B/sak/$SAK_ID/soknad/$SOKNAD_ID/behandling/ny-behandling" -H "$T1" -H "$CT"
```

Deretter kjør [Felles behandlingssteg](#felles-behandlingssteg).

### Papir inngang (curl)

```bash
# Lag en tom sak for fnr 12345678911
SAKSNR=$(curl -s -X PUT "$B/sak" -H "$T1" -H "$CT" -d '{"fnr":"12345678911"}' \
  | python3 -c 'import sys,json;print(json.load(sys.stdin)["saksnummer"])')

# Registrer papirsøknad – dette starter også søknadsbehandlingen
curl -s -X POST "$B/sak/$SAKSNR/soknad" -H "$T1" -H "$CT" -d '{
  "journalpostId":"12345",
  "manueltSattSøknadsperiode":{"fraOgMed":"2025-04-01","tilOgMed":"2025-04-10"},
  "manueltSattTiltak":null,
  "antallVedlegg":0,
  "søknadstype":"PAPIR_SKJEMA",
  "behandlingsarsak":null,
  "svar":{
    "tiltak":{"eksternDeltakelseId":"'"$(uuidgen)"'","deltakelseFraOgMed":"2025-04-01","deltakelseTilOgMed":"2025-04-10","typeKode":"GRUPPE_AMO","typeNavn":"Gruppe AMO"},
    "barnetilleggPdl":[],"barnetilleggManuelle":[],
    "harSøktPåTiltak":{"svar":"JA"},"harSøktOmBarnetillegg":{"svar":"NEI"},
    "kvp":{"svar":"NEI","fraOgMed":null,"tilOgMed":null},
    "intro":{"svar":"NEI","fraOgMed":null,"tilOgMed":null},
    "institusjon":{"svar":"NEI","fraOgMed":null,"tilOgMed":null},
    "etterlønn":{"svar":"NEI"},
    "gjenlevendepensjon":{"svar":"NEI","fraOgMed":null,"tilOgMed":null},
    "alderspensjon":{"svar":"NEI","fraOgMed":null},
    "sykepenger":{"svar":"NEI","fraOgMed":null,"tilOgMed":null},
    "supplerendeStønadAlder":{"svar":"NEI","fraOgMed":null,"tilOgMed":null},
    "supplerendeStønadFlyktning":{"svar":"NEI","fraOgMed":null,"tilOgMed":null},
    "jobbsjansen":{"svar":"NEI","fraOgMed":null,"tilOgMed":null},
    "trygdOgPensjon":{"svar":"NEI","fraOgMed":null,"tilOgMed":null}
  }
}'
# Svaret er en Søknadsbehandling-DTO: .id = behandlingId,
# .saksopplysninger.tiltaksdeltagelse[0].internDeltakelseId
```

Deretter kjør [Felles behandlingssteg](#felles-behandlingssteg) (papir hopper altså
over `ny-behandling`).

---

## GUI — fra A til Å

Under er full klikksti i frontend. Den speiler curl-stegene over.

### A. Opprette saken og søknaden

**Digital søknad:**

1. Åpne frontend og logg inn (lokalt: du er saksbehandler `A123456`).
2. Generer en digital testsøknad via dev-routen (enten med
   `./scripts/testdata/seed-digital-soknad.sh`, eller `POST /dev/soknad/ny`). Noter
   saksnummeret som returneres.
3. Søk opp saksnummeret i frontend. Du er nå på personoversikten, med en åpen
   søknad.

**Papirsøknad (manuelt registrert):**

1. Åpne frontend og søk opp en person via fødselsnummer `12345678911`. Når du åpner
   personoversikten opprettes en sak automatisk (`hent eller opprett sak`).
2. Velg **registrer manuell søknad** / **papirsøknad** på personoversikten.
3. Fyll ut skjemaet:
   - journalpost-ID `12345`,
   - søknadstype **papir**,
   - søknadsperiode `01.04.2025`–`10.04.2025`,
   - velg et tiltak med samme periode,
   - svar **nei** på de øvrige spørsmålene (KVP, intro, institusjon, andre ytelser
     osv.).
4. Lagre. Søknadsbehandlingen opprettes og åpnes automatisk.

### B. Behandle søknaden til innvilget vedtak

5. Åpne søknadsbehandlingen (fra personoversikten eller direkte fra forrige steg).
6. Vurder til **innvilgelse** med innvilgelsesperiode `01.04.2025`–`10.04.2025` på
   det valgte tiltaket.
7. Fyll inn begrunnelse og fritekst til vedtaksbrev, og **send til beslutning**.

### C. Beslutte og iverksette (4-øyne)

8. Logg inn som en **annen** bruker (beslutter `B123456`).
9. Ta behandlingen til beslutning, kontroller, og **iverksett** vedtaket.

### D. Opprette meldekortbehandling

10. Gå tilbake til saken. Meldeperiodene er nå tilgjengelige (vedtaket genererte
    dem).
11. Velg en meldeperiode og **opprett meldekortbehandling**.

### E. Opprette klagebehandling

12. På saken, velg **opprett klage** / **ny klagebehandling**.
13. Fyll ut klageskjemaet (klager er part, klagefrist overholdt, klagen er signert,
    innsendingsdato, innsendingskilde) og lagre.

---

## Resette lokal database

Ved Flyway-trøbbel som hindrer `LokalMain` i å starte, dropp og gjenopprett
databasen:

```bash
docker exec -i tiltakspenger-postgresSaksbehandling-1 \
  psql -U postgres -c \
  "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'saksbehandling' AND pid <> pg_backend_pid();"

docker exec -i tiltakspenger-postgresSaksbehandling-1 \
  psql -U postgres -c "DROP DATABASE IF EXISTS saksbehandling;"

docker exec -i tiltakspenger-postgresSaksbehandling-1 \
  psql -U postgres -c "CREATE DATABASE saksbehandling;"
```

Start `LokalMain` på nytt etterpå; Flyway kjører migreringene fra bunnen.
