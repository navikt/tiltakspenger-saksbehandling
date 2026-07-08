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

## Lag 3 – toppnivå

- `opprett-alt-digital.sh` – digital innvilgelse + meldekortbehandling + klage.
- `opprett-alt-papir.sh` – papir innvilgelse + meldekortbehandling + klage.
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
