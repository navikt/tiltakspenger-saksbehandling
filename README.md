Tiltakspenger-saksbehandler
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

Opprett en `.env.local` på roten av `tiltakspenger-saksbehandler`, med følgende innhold

```
TILTAKSPENGER_VEDTAK_URL=http://localhost:8080
TILTAKSPENGER_MELDEKORT_URL= http://localhost:8081
TILTAKSPENGER_UTBETALING_URL= http://localhost:8083
VEDTAK_SCOPE=tiltakspenger-vedtak
MELDEKORT_SCOPE=tiltakspenger-meldekort-api
UTBETALING_SCOPE=tiltakspenger-utbetaling
AZURE_APP_CLIENT_ID=tiltakspenger-vedtak
AZURE_APP_CLIENT_SECRET=secret
AZURE_APP_WELL_KNOWN_URL=http://host.docker.internal:6969/azure/.well-known/openid-configuration
AZURE_OPENID_CONFIG_ISSUER="http://host.docker.internal:6969/azure"
AZURE_OPENID_CONFIG_JWKS_URI=http://host.docker.internal:6969/azure/jwks
AZURE_OPENID_CONFIG_TOKEN_ENDPOINT=http://host.docker.internal:6969/azure/token
AZURE_APP_JWK= * Se JWK i wonderwallconfig *
```

Det er lagd et docker-compose oppsett i `docker-compose.yml` som mocker ut Azure ved hjelp av bl.a. [mock-oauth2-server](https://github.com/navikt/mock-oauth2-server)
og [Wonderwall](https://doc.nais.io/appendix/wonderwall/), som appen er avhengig av når den kjører i miljø.

docker-compose oppsettet antar at man har [tiltakspenger-vedtak](https://github.com/navikt/tiltakspenger-vedtak) repoet 
liggende lokalt på `./../` relativt til tiltakspenger-saksbehandler, og vil per nå bruke `Dockerfile` som ligger der for å bygge imaget til tiltakspenger-vedtak.

For å starte opp alt som trengs for å kjøre frontenden (og backenden) må man først sørge for at colima / docker kjører
så må man navigere til root av BACKEND-prosjektet og bygge det med kommandoen `./gradlew build app:installDist`.
og så navigere til root av FRONTEND-prosjektet og kjøre kommandoen `docker-compose up --build -d`.
Om dette ikke fungerer må du se på docker-oppsettet ditt. Se på [denne siden](https://confluence.adeo.no/display/POAO/Ny+Utvikler+i+Tiltakspenger) for tips

tiltakspenger-vedtak må bygges med gradle før Docker-imaget vil kunne bygges. `./gradlew build app:installDist` på rot av tiltakspenger-vedtak.
Etter man har gjort det skal verdikjeden kunne kjøres opp med `docker-compose up --build -d` på rot av tiltakspenger-saksbehandler.

---

Man kan teste rollene lokalt ved å legge rollene inn som optional claims i mock-oauth2-server.


Dette kan pastes inn i mock oauth2-wonderwallen for å gi roller (saksbehandler, beslutter, administrator hhv.):
```
{
    "groups": [
        "1b3a2c4d-d620-4fcf-a29b-a6cdadf29680", 
        "79985315-b2de-40b8-a740-9510796993c6",
        "cbe715d0-6f67-46bf-86b4-688c4419b747"
    ]
}
```

Da må man kjøre opp docker-compose uten roller med
```./up-uten.roller.sh```


## E2E tester

Testene ligger i repoet [her](https://github.com/navikt/tiltakspenger-e2e-tests). Kan kjøres opp lokalt eller trigges manuelt via workflow dispatch.

# Demo-versjon

`tiltakspenger-saksbehandler` er i dag kjørt opp på [https://tiltakspenger-saksbehandler.labs.nais.io](https://tiltakspenger-saksbehandler.labs.nais.io). Denne versjonen deployes manuelt via en workflow dispatch.

# 📣 Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub

## For NAV-ansatte

Interne, tekniske henvendelser kan sendes via Slack i kanalen #tpts-tech.
