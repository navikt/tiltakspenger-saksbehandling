# scripts/testdata

Lagvis shell-bibliotek for lokal testdata mot LokalMain (`http://localhost:8080`).

## Hurtigstart

- `./opprett-alt-digital.sh`
- `./opprett-alt-papir.sh`
- `./forhandsvis-alle-pdfer.sh` – alle PDF-brev via routes (krever pdfgen + pdfgenrs i docker).

## Lag 1 – per endpoint

- `_lib.sh` – felles helpers (BASE_URL, tokens, HTTP, jval, server-sjekk, logging,
  `post_og_lagre_pdfer` for PDF-responser inkl. multipart).
- `seed-digital-soknad.sh` – oppretter digital søknad via `/dev/soknad/ny`.
- `hent-eller-opprett-sak.sh` – oppretter/henter sak via `PUT /sak`.
- `registrer-papir-soknad.sh` – registrerer papir-søknad og returnerer behandling/id.
- `hent-sak.sh` – henter sak og evt. trekker ut felt via uttrykk.
- `start-soknadsbehandling.sh` – oppretter søknadsbehandling for digital søknad.
- `oppdater-innvilgelse.sh` – oppdaterer behandling med resultat INNVILGELSE.
- `send-til-beslutning.sh` – sender behandling til beslutning.
- `ta-behandling.sh` – beslutter tar behandlingen (4-øyne).
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
  REVURDERING_INNVILGELSE | OMGJØRING | OMGJØRING_OPPHØR) og lagrer PDF-ene.
- `forhandsvis-klagebrev.sh SAK_ID KLAGE_ID [NAVN]` – forhåndsviser klagebrev
  (avvisning eller innstilling, avhengig av klagens tilstand) og lagrer PDF-ene.
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
  (default `/tmp/tiltakspenger-pdfer`); lokalt får du både pdfgen- og
  pdfgenrs-varianten av hvert brev for sammenligning.

## PDF-forhåndsvisning: forutsetninger

`LokalMain` bruker ekte pdfgen-klient, og lokalt gjøres skygge-kall mot pdfgenrs i
parallell. Begge må derfor kjøre i docker for at forhåndsvisning skal virke:
pdfgen på `8081` og pdfgenrs på `8084` (`docker compose up -d` i metarepoet).
Responsen er multipart med to PDF-er (pdfgen først, pdfgenrs som nummer to) —
`post_og_lagre_pdfer` i `_lib.sh` splitter og lagrer begge.

PDF-er som kun genereres av jobber (journalføring av vedtaksbrev m.m.) dekkes
ikke av disse scriptene.
