Tiltakspenger-saksbehandling
================

Frontend-koden for støtteverktøy til bruk i saksbehandling av Tiltakspenger.

# 🚀 Komme i gang

For å kjøre opp frontend i dev

```
pnpm install
pnpm dev
```

## Lokalt oppsett for hele verdikjeden
Hele verdikjeden kan kjøres opp lokalt, med noen komponenter mocket ut. Det krever følgende oppsett

Legg til følgende i `/etc/hosts`

```
127.0.0.1 host.docker.internal
```

Opprett en `.env.local` på roten av `tiltakspenger-saksbehandling`, med følgende innhold

```
TILTAKSPENGER_SAKSBEHANDLING_API_URL=http://localhost:8080
GOSYS_URL=https://gosys-q2.dev.intern.nav.no/gosys
MODIA_PERSONOVERSIKT_URL=https://modiapersonoversikt.intern.dev.nav.no/
WONDERWALL_ORIGIN=http://localhost:2222
SAKSBEHANDLING_API_SCOPE=tiltakspenger-saksbehandling-api
AZURE_APP_CLIENT_ID=tiltakspenger-saksbehandling
AZURE_APP_CLIENT_SECRET=secret
AZURE_APP_WELL_KNOWN_URL=http://host.docker.internal:6969/azuread/.well-known/openid-configuration
AZURE_OPENID_CONFIG_ISSUER="http://host.docker.internal:6969/azuread"
AZURE_OPENID_CONFIG_JWKS_URI=http://host.docker.internal:6969/azuread/jwks
AZURE_OPENID_CONFIG_TOKEN_ENDPOINT=http://host.docker.internal:6969/azuread/token
AZURE_APP_JWK= * Se JWK i wonderwallconfig *
BRUK_LOKAL_FAKE_TOKEN=true <ikke inkluder denne hvis du vil bruke ekte auth-tjenester lokalt>
LOKAL_FAKE_TOKEN=TokenMcTokenface
```

Det er laget et docker-compose oppsett i `docker-compose.yml` i [tiltakspenger-meta-repo](https://github.com/navikt/tiltakspenger) som kjører opp verdikjeden lokalt.

Se på [denne siden](https://confluence.adeo.no/display/POAO/Ny+Utvikler+i+Tiltakspenger) for tips til lokalt oppsett av utviklingsmiljø.

Hvis du kjører ekte auth-tjenester lokalt, er appen tilgjengelig via wonderwall på http://localhost:2222

Ved bruk av fake tokens, gå rett på http://localhost:3000.

Du kan bytte fake-token/fake-bruker ved å sette i .env.local `LOKAL_FAKE_TOKEN=<token>`
Gyldige verdier for lokal backend er `TokenMcTokenface` (default) og `TokenMcTokenface2`

Dette kan være nyttig når du kjapt vil bytte mellom en saksbehandler og beslutter lokalt.

---

### pnpm how-to

Repoet bruker [pnpm](https://pnpm.io/) som package manager, pinnet via `packageManager`-feltet i `package.json`
og håndtert av [Corepack](https://nodejs.org/api/corepack.html) (som følger med Node.js).

- **Førstegangsoppsett:** kjør `corepack enable` én gang per maskin. Deretter laster Corepack ned og
  bruker akkurat den pnpm-versjonen som er pinnet i `package.json`, uten global installasjon. Slett node_modules
  og kjør `pnpm i` dersom du har node_modules fra npm.
- **Husky-hooks:** siden `.npmrc` har `ignore-scripts=true` kjøres ikke `prepare`-scriptet automatisk
  etter `pnpm install`. Kjør `pnpm run prepare` én gang etter første installasjon for å sette opp
  git-hookene.
- **JetBrains IDE:** når du åpner prosjektet vil IntelliJ oppdage `pnpm-lock.yaml` og foreslå å bytte
  package manager til pnpm under *Settings → Languages & Frameworks → Node.js → Package manager*.
  Aksepter det.
- **Oppgradering av pnpm:** endre versjonen i `packageManager`-feltet i `package.json` og commit.
  Corepack plukker opp den nye versjonen automatisk hos alle utviklere og i CI.
- **Dependabot** oppdaterer `pnpm-lock.yaml` på samme måte som tidligere — ingen konfigurasjonsendring
  nødvendig.

---

## Lenke til dev-miljø

`tiltakspenger-saksbehandling` er i dag kjørt opp på [https://tiltakspenger-saksbehandling.ansatt.dev.nav.no/](https://tiltakspenger-saksbehandling.ansatt.dev.nav.no/). Denne versjonen deployes manuelt via en workflow dispatch.

## 📣 Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub

## For NAV-ansatte

Interne, tekniske henvendelser kan sendes via Slack i kanalen #tp-utvikling.
