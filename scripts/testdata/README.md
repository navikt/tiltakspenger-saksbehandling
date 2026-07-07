# scripts/testdata

Lagvis shell-bibliotek for lokal testdata mot LokalMain (`http://localhost:8080`).

## Hurtigstart

- `./opprett-alt-digital.sh`
- `./opprett-alt-papir.sh`

## Lag 1 – per endpoint

- `_lib.sh` – felles helpers (BASE_URL, tokens, HTTP, jval, server-sjekk, logging).
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
- `opprett-klage.sh` – oppretter klagebehandling.

## Lag 2 – kombinasjoner

- `innvilg-og-iverksett.sh` – kjører oppdater → sendtilbeslutning → ta → iverksett.
- `opprett-innvilget-sak-digital.sh` – digital flyt frem til iverksatt innvilgelse.
- `opprett-innvilget-sak-papir.sh` – papirflyt frem til iverksatt innvilgelse.

## Lag 3 – toppnivå

- `opprett-alt-digital.sh` – digital innvilgelse + meldekortbehandling + klage.
- `opprett-alt-papir.sh` – papir innvilgelse + meldekortbehandling + klage.
