Tiltakspenger-saksbehandling
================

Frontend-koden for støtteverktøy til bruk i saksbehandling av Tiltakspenger.

# 🚀 Komme i gang

For å kjøre opp frontend i dev

```
npm install
npm run dev
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
```

Det er laget et docker-compose oppsett i `docker-compose.yml` i [tiltakspenger-meta-repo](https://github.com/navikt/tiltakspenger) som kjører opp verdikjeden lokalt.

Se på [denne siden](https://confluence.adeo.no/display/POAO/Ny+Utvikler+i+Tiltakspenger) for tips til lokalt oppsett av utviklingsmiljø.

---

## Lenke til dev-miljø

`tiltakspenger-saksbehandling` er i dag kjørt opp på [https://tiltakspenger-saksbehandling.ansatt.dev.nav.no/](https://tiltakspenger-saksbehandling.ansatt.dev.nav.no/). Denne versjonen deployes manuelt via en workflow dispatch.

## 📣 Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub

## For NAV-ansatte

Interne, tekniske henvendelser kan sendes via Slack i kanalen #tp-utvikling.
