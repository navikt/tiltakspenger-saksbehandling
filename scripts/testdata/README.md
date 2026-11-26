# scripts/testdata

Lagvis shell-bibliotek for lokal testdata mot LokalMain (`http://localhost:8080`).

## Hurtigstart

- `./opprett-alt-digital.sh`
- `./opprett-alt-papir.sh`
- `./forhandsvis-alle-pdfer.sh` – alle PDF-brev via routes (krever pdfgenrs i docker).

## Lag 1 – per endpoint

- `_lib.sh` – felles helpers (BASE_URL, tokens, HTTP, jval, server-sjekk, logging,
  `post_og_lagre_pdfer` for PDF-responser).
- `seed-digital-soknad.sh` – oppretter digital søknad via `/dev/soknad/ny`.
- `hent-eller-opprett-sak.sh FNR [V2|V3]` – oppretter/henter sak via `PUT /sak`; versjonen velger oppdragsversjon når saken opprettes, og avvises i produksjon.
- `registrer-papir-soknad.sh SAKSNUMMER [SOKNADSTYPE]` – registrerer papirsøknad og returnerer behandling/id. Journalposten er `12345` lokalt og brukerens egen fra SAF i dev; `JOURNALPOST_ID` overstyrer. Tiltaket er fiktivt lokalt; i dev gjelder søknaden hele tiltaket med indeks `TILTAKSINDEKS` (default 0) blant tiltaksdeltakelsene på saken i sb-api (2023–2027) som gir rett. Mottatt dato er tiltakets startdato; `SOKNAD_MOTTATT_DATO` overstyrer.
- `hent-sak.sh` – henter sak og evt. trekker ut felt via uttrykk.
- `start-soknadsbehandling.sh` – oppretter søknadsbehandling for digital søknad.
- `oppdater-innvilgelse.sh` – oppdaterer behandling med resultat INNVILGELSE.
- `send-til-beslutning.sh` – sender behandling til beslutning.
- `ta-behandling.sh` – beslutter tar behandlingen (4-øyne) via `POST /behandlinger/ta`.
- `iverksett.sh` – beslutter iverksetter behandlingen.
- `opprett-meldekortbehandling.sh` – oppretter meldekortbehandling for kjede.
- `_meldekort_flyt.py` – delt driver for meldekortflyten (opprett, fyll ut,
  til beslutning, ta, iverksett); brukes av meldekort-scriptene under.
- `opprett-klage.sh SAK_ID [VEDTAK_ID]` – oppretter klagebehandling (med VEDTAK_ID:
  klage på vedtaket, kan opprettholdes).
- `start-revurdering.sh SAK_ID TYPE [RAMMEVEDTAK_ID]` – starter revurdering
  (STANS | REVURDERING_INNVILGELSE | OMGJØRING).
- `vurder-klage-oppretthold.sh SAK_ID KLAGE_ID` – vurderer klage til OPPRETTHOLD.
- `forhandsvis-vedtaksbrev.sh SAK_ID BEH_ID RESULTAT [INTERN_DELTAKELSE_ID]` –
  forhåndsviser rammevedtaksbrev (INNVILGELSE | AVSLAG | STANS |
  REVURDERING_INNVILGELSE | OMGJØRING | OMGJØRING_OPPHØR) og lagrer PDF-en.
- `forhandsvis-klagebrev.sh SAK_ID KLAGE_ID [NAVN]` – forhåndsviser klagebrev
  (avvisning eller innstilling, avhengig av klagens tilstand) og lagrer PDF-en.
- `forhandsvis-meldekortbrev.sh SAKSNUMMER MELDEKORT_ID` – forhåndsviser
  meldekortvedtaksbrev og lagrer PDF-en.

## Lag 2 – kombinasjoner

- `innvilg-og-iverksett.sh` – kjører oppdater → sendtilbeslutning → ta → iverksett.
- `opprett-innvilget-sak-digital.sh` – digital flyt frem til iverksatt innvilgelse.
- `opprett-innvilget-sak-papir.sh` – papirflyt frem til iverksatt innvilgelse.
- `fyll-og-iverksett-meldekort.sh SAKSNUMMER [DATO=STATUS ...]` – oppretter, fyller
  ut og iverksetter meldekort på første kjede (default: rett-hverdager deltatt).
- `opprett-meldekort-korrigering.sh SAKSNUMMER [DATO=STATUS ...]` – korrigerende
  meldekortbehandling som blir stående åpen, med simulering i behandlingsbildet.

## Lag 3 – toppnivå

- `opprett-alt-digital.sh` – digital innvilgelse + meldekortbehandling + klage.
- `opprett-alt-papir.sh` – papir innvilgelse + meldekortbehandling + klage.
- `opprett-simuleringsscenarioer.sh` – elleve saker som dekker simuleringsvisningene:
  ren ytelse, feilutbetaling, justering endags/flerdags, ubalansert justering,
  trekk med reversering, trekk med justering på tvers av meldeperioder (dev-casen
  i `TrekkMedJusteringFraDevTest`, tillates med advarsel), justering over
  månedsskiftet, ytelse flyttet mellom meldeperioder (sperres), feilutbetaling
  + etterbetaling splittet av månedsskiftet, og en eksakt avspilling av dev-casen
  i `TrekkMedJusteringFraDevTest` (innspilte responser, valgt på meldeperiode). Sperre-scenarioene trigges av faste
  test-fødselsnumre som simuleringsfaken kjenner igjen (`DevSimuleringsscenario`
  i saksbehandling-api). Personer gjenbrukes mellom kjøringer lokalt – endrer du
  et scenariooppsett, bytt fnr i både enumen og skriptet, eller nullstill basen.
- `forhandsvis-alle-pdfer.sh` – innvilget sak + forhåndsvisning av alle PDF-brev
  (vedtaksbrev, meldekortvedtaksbrev, klagebrev). PDF-ene lagres i `$PDF_UT_DIR`
  (default `/tmp/tiltakspenger-pdfer`), én fil per brev.

## Dev

Scriptene kan kjøre mot sb-api i dev med `MILJO=dev`.
`send-soknad-dev.sh` og `helved-v3-scenarioer.sh` setter dette selv.

Tokens lages av en person, ikke av scriptene, og varer én time.
`dev-token.sh` åpner [tokengeneratoren](https://azure-token-generator.intern.dev.nav.no/api/obo?aud=dev-gcp:tpts:tiltakspenger-saksbehandling-api), ber Entra spørre hvilken konto du vil bruke, leser tokenet fra utklippstavlen etter at du har kopiert det, og lagrer det som `.dev-tokens/dev-token-<NAVident>` ved siden av scriptet (ignorert av git).
Kjør det én gang per ident du vil ha med.
`dev-token.sh liste` viser de lagrede tokenene med ident, roller og utløpstid.

```bash
./dev-token.sh
./dev-token.sh liste
```

Scriptene leser rollene fra `groups` i tokenet og velger selv en saksbehandler og en beslutter med en annen ident (fire øyne).
Velg en bestemt ident med `DEV_SAKSBEHANDLER=<ident>` eller `DEV_BESLUTTER=<ident>`.
En bruker med fortrolig eller strengt fortrolig adresse gir 403 med `tilgang_nektet_kode_7` eller `tilgang_nektet_kode_6`; begge identene må da ha tilgang til den graderingen, og tokenets `groups` viser ikke det.

`_lib.sh` stopper og viser `dev-token.sh`-kommandoen når et token mangler eller har utløpt.

Scriptene godtar bare syntetiske fødselsnumre: Navs serie fra Dolly og testnorge (måned + 40) og Skatteetatens (måned + 80), altså 4–9 som tredje siffer.
`finn-testbrukere.sh` hopper over andre rader uten å skrive dem ut.

- `finn-testbrukere.sh [FANE ...]` – lister saker fra benken med saksnummer, fnr, oppdragsversjon som datohint, fane og status.
- `migrer-uten-kontrollsimulering.sh SAKSNUMMER ...` – migrerer flere V2-saker parallelt, opphever sperren straks uten kontrollsimulering og iverksetter et meldekort etter OK fra Hel Ved.
- `sjekk-testbrukere.sh` – slår opp hver bruker i `.dev-testbrukere.json` (tiltak med rett på tiltakspenger fra `GET /tiltak` i soknad-api, og sak fra sb-api), lagrer svaret i fila og lister brukerne med søkbare tiltak. `V3-KLAR` er `ja` når brukeren ikke har sak og et tiltak startet minst fire uker tilbake og varer forbi kravfristen.
- `send-soknad-dev.sh FNR [TILTAKSINDEKS]` – sender en søknad til soknad-api i dev som brukeren selv (TokenX-token fra tokengeneratoren) og venter til den er hos sb-api.
- `fullfor-soknadsbehandling.sh SAKSNUMMER [FOM TOM]` – fører den nyeste søknadsbehandlingen fram til vedtak, også når den starter som automatisk behandling. Virker lokalt også.
- `helved-v3-scenarioer.sh FNR|SAKSNUMMER [TILTAKSINDEKS]` – legacy-modus med innvilgelse, første utbetaling, ny meldeperiode, korrigering med feilutbetaling, korrigering med etterbetaling og stans på én sak.
- `helved-v3-scenarioer.sh forbered-papir FNR V2|V3 [TILTAKSINDEKS]` – oppretter en ny sak, registrerer papirsøknad og fører den til VEDTATT.
- `helved-v3-scenarioer.sh fullfor MANIFEST.tsv` – fører hver unike sak i første kolonne til VEDTATT og hopper over en allerede vedtatt nyeste papirsøknad.
- `helved-v3-scenarioer.sh simuler-gate MANIFEST.tsv` – leser sakene og skriver blokkeringer uten å endre dem.
- `helved-v3-scenarioer.sh utbetaling MANIFEST.tsv` – krever at alle sakene passerer den strengere simuleringsgaten før de seks V3-stegene kjøres sekvensielt.
- `helved-v3-scenarioer.sh verifiser-helved MANIFEST.tsv` – leser Hel Ved-hendelser fra Peisschtappern med ett maskintoken, skriver en TSV-rapport per sak og er helt skrivebeskyttet.
- Kontroller utbetalingene fra legacy-modusen og batchflyten i [Utbetalingsportalen](https://utbetalingsportalen.intern.dev.nav.no/oppdragsinfo/oppdrag) og [Peisen](https://peisen.intern.dev.nav.no/).

En papirsøknad krever en journalpost i Joark som gjelder brukeren og har opprettelsesdato; sb-api sjekker det mot SAF.
Samme journalpost kan brukes til flere søknader.
Scriptene under snakker rett med SAF og dokarkiv i dev med maskintoken fra tokengeneratoren, så de trenger naisdevice, men ingen OBO-tokens.

- `finn-journalpost.sh FNR` – skriver ut en av brukerens journalposter fra SAF, helst en søknad med tema IND, ellers den nyeste. `registrer-papir-soknad.sh` bruker den selv i dev.
- `opprett-journalpost.sh FNR` – lager en inngående journalpost med en skannet testsøknad (tema IND, kanal SKAN_IM) i dokarkiv og skriver ut id-en. Bruk den når brukeren ikke har noen journalposter, i stedet for å lage en i Gosys. `tiltakspenger-journalposthendelser` journalfører den på brukerens sak, eller lager en journalføringsoppgave i Gosys i dev, som for en ekte papirsøknad.

```bash
MILJO=dev ./hent-eller-opprett-sak.sh <FNR> V2
./finn-journalpost.sh <FNR> || ./opprett-journalpost.sh <FNR>
MILJO=dev ./registrer-papir-soknad.sh <SAKSNUMMER>
```

`hent-eller-opprett-sak.sh FNR [V2|V3] --med-opprettelse` skriver `SAKSNUMMER` og `OPPRETTET` fra samme respons; uten dette valget beholdes den gamle saksnummerutskriften.
`helved-v3-scenarioer.sh` bruker `GET /sak/{saksnummer}/oppdragstilstand` som autoritativ kilde for oppdragsversjon og sperrestatus i dev/lokalt.
Skriptet stopper hvis dette endepunktet mangler, svarer 404 eller ikke kan tolkes sikkert.
Datoen i saksnummeret er bare et hint og skal aldri brukes som versjonsbevis.
Bruk `OPPDRAGSVERSJON` fra en vellykket `forbered-papir`-kjøring på en nyopprettet sak eller en annen autoritativ kontroll når du fyller manifestet.
Oppdragstilstand-endepunktet brukes ikke i produksjon.
En ny sak på V2 i dev lages med `MILJO=dev ./hent-eller-opprett-sak.sh FNR V2` før søknaden sendes; finnes saken allerede, beholder den versjonen den har.
Brukeren må ha en tiltaksdeltakelse som gir rett og har startet minst fire uker tilbake, ellers er meldeperiodene ikke klare.
`migrer-uten-kontrollsimulering.sh` tar saksnumre fra argumenter eller stdin, skriver TSV til stdout og kjører migreringene med fem samtidige kall som standard.
Etter en vellykket migrering kjører skriptet `fyll-og-iverksett-meldekort.sh` for samme sak; utbetalingen sendes videre av den planlagte jobben, som kjører hvert tiende sekund i dev.
Skriptet krever at første meldeperiode kan iverksettes, og skal bare brukes mot fiktive testdata i dev.
For eksempel kan du lagre resultatene med `MILJO=dev ./scripts/testdata/migrer-uten-kontrollsimulering.sh 202611111001 202611111002 > migrering.tsv`.
`.dev-testbrukere.json` er gitignored og bygges fra tabellene på Confluence-sidene «Gamle testbrukere - 1» og «- 2», «Test for brukerstøtte - Ny vedtaksløsning for tiltakspenger» og «Test i Øst-Viken» under «Test i tiltakspenger».
Fila har én oppføring per fnr med `fnr`, `navn` og `forekomster` (side og tabellkolonner), og `sjekk-testbrukere.sh` legger til `sjekk`.
Nye brukere lages manuelt i Dolly og Modia etter oppskriften «Hvordan opprette testbrukere med tiltaksdeltakelse i Modia» på teamets Confluence-område; det gjelder også identbytte.

`migrer-uten-kontrollsimulering.sh` og `opphevSperrenStraks=true` er aldri bevis på normal migrering.
Normal migrering må testes med egne V2-saker og avklart historikk; 51 V3-saker dokumenterer ikke migrering.

## Hel Ved V3 med papirsaker i batch

Kjør kommandoene fra `scripts/testdata/` i `tiltakspenger-saksbehandling`.
Bruk bare fiktive testbrukere i dev; Dolly- og Modia-oppretting, tokens og nødvendige journalposter er manuelle eller eksterne forutsetninger.
`forbered-papir` krever eksplisitt `V2` eller `V3` og oppretter bare en ny sak.
Skriptet avviser en eksisterende sak før papirregistrering fordi oppdragsversjonen ikke kan verifiseres fra `GET /sak`.
Bruk legacy-modus eller `fullfor` for eksisterende saker først etter at oppdragsversjonen er verifisert fra en autoritativ kilde.
En vellykket kjøring skriver ut `OPPDRAGSVERSJON=V2` eller `OPPDRAGSVERSJON=V3` fra den eksplisitte opprettelsen, og dette er unntaket som ikke trenger oppdragstilstand-endepunktet.
Bruk verdien som grunnlag for manifestets `VERSJON`.
`TILTAKSINDEKS` påvirker bare registreringen av papirsøknaden.

```bash
./helved-v3-scenarioer.sh forbered-papir "$FNR" V3
./helved-v3-scenarioer.sh fullfor papir-saker.tsv
./helved-v3-scenarioer.sh simuler-gate utbetaling.tsv
./helved-v3-scenarioer.sh utbetaling utbetaling.tsv
./helved-v3-scenarioer.sh verifiser-helved helved-verifisering.tsv
```

`fullfor` leser saksnummer fra første TSV-kolonne eller fra en linje med bare saksnummer, ignorerer tomme linjer og kommentarer som starter med `#`, og fjerner duplikater.
`fullfor` hopper over en vedtatt papirsøknad selv om en nyere digital søknad finnes, men avviser en delvis aktiv papirsøknad hvis den ikke er sakens nyeste søknadsbehandling.
En valgfri overskrift for `fullfor` er én kolonne med navnet `SAKSNUMMER`.
`simuler-gate` og `utbetaling` leser én sak per linje med nøyaktig kolonnene `SAKSNUMMER`, `VERSJON`, `OPPDRAG_BEREGNET` og `SIMULERING_OK`.
Den valgfrie overskriften må bruke de samme fire kolonnenavnene i samme rekkefølge.
`VERSJON` må være `V2` eller `V3`, og bekreftelsene må være `ja` eller `nei`; bare `ja` slipper gjennom.
`VERSJON` er operatørens eksplisitte bevis og skal komme fra `OPPDRAGSVERSJON` på en nyopprettet sak eller en annen autoritativ kontroll, ikke fra datoen i saksnummeret alene.
Kommentarer som starter med `#` og tomme linjer er tillatt, men feilformatert manifest avvises før saksbehandling.
`simuler-gate` er skrivebeskyttet og kan kontrollere saker som allerede har meldekortbehandlinger.
`simuler-gate` leser `GET /sak/{saksnummer}/oppdragstilstand` for hver rad, rapporterer blokkeringer per sak og stopper aldri tidlig i manifestet.
`utbetaling` godtar bare `VERSJON=V3`, krever minst to kjeder, VEDTATT papirsøknadsbehandling, ingen åpne behandlinger og to hverdager som gir rett i hver av de første kjedene.
`utbetaling` avviser også saker med eksisterende meldekortbehandlinger i de to første kjedene, slik at flyten bare kjører på urørte saker.
`utbetaling` kjører den samme oppdragstilstand-kontrollen både i gaten og rett før første mutering i hver sak, og stopper hvis endepunktet ikke kan leses.
Kjør først `simuler-gate` for å se blokkeringer uten mutering, og kjør deretter `utbetaling` først når alle radene er klare.
`OPPDRAG_BEREGNET=ja` betyr at operatøren har bekreftet at Oppdragssystemet fullførte en relevant Q1-beregning etter at saken ble `VEDTATT`.
Beregningens faktiske tidsplan er ikke verifisert.
Bekreftelsen er ikke en kontroll mot et Hel Ved-statusendepunkt.
`SIMULERING_OK=ja` bekrefter at en faktisk, separat simulering viste forventet Q1-resultat.
Før du iverksetter et meldekort, sender en V3-melding eller går videre med migrering, må simuleringen vise forventet Q1-resultat.
Registrer forventet Q1-resultat og eventuelle avvik for hver sak og hvert scenario.
Skriptet venter ikke på et klokkeslett og poller ikke Oppdragssystemet.
Skriptet automatiserer ikke Dolly eller Modia, tokenfornyelse, eksterne statuser, duplikater, rekkefølgefeil, timeoutinjeksjon eller produksjon.
Hel Ved V3-sakene er ikke migreringstester; normal migrering krever egne V2-saker og avklart historikk.
Normal migrering skal aldri bruke `opphevSperrenStraks=true` eller `migrer-uten-kontrollsimulering.sh` som bevis.
`verifiser-helved` leser en egen TSV med `SAKSNUMMER` og `FORVENTET_OK` og henter `GET /api/saker/<saksnummer>/TILTPENG` fra Peisschtappern for hver sak.
`SAKSNUMMER` i verifiseringsmanifestet er det eksterne Hel Ved-saksnummeret, ikke id fra saksbehandlings-API-et på formen `sak_*`.
Verifiseringen sjekker bare oppdragsstatus i Peisschtappern og er ikke bevis på simulering, migrering, driftsskjema eller fravær av personopplysninger.

Eksempel på verifiseringsmanifest:

```tsv
SAKSNUMMER	FORVENTET_OK
202611201001	1
```

## PDF-forhåndsvisning: forutsetninger

`LokalMain` bruker ekte pdfgenrs-klient, så pdfgenrs må kjøre i docker på `8084`
for at forhåndsvisning skal virke (`docker compose up -d` i metarepoet).
Responsen er én PDF, som `post_og_lagre_pdfer` i `_lib.sh` lagrer til fil.

PDF-er som kun genereres av jobber (journalføring av vedtaksbrev m.m.) dekkes
ikke av disse scriptene.
