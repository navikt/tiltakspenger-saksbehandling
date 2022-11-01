Tiltakspenger-assistent
================

Frontend-koden for støtteverktøy til bruk i saksbehandling av Tiltakspenger.

# Komme i gang

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

Opprett en `.env.local` på roten av `tiltakspenger-assistent`, med følgende innhold

```
TILTAKSPENGER_VEDTAK_URL=http://localhost:8080
AZURE_APP_CLIENT_ID=tiltakspenger-vedtak
AZURE_APP_CLIENT_SECRET=secret
AUTH_PROVIDER_URL=http://host.docker.internal:6969/azure/token
SCOPE=tiltakspenger-vedtak
```

Det er lagd et docker-compose oppsett i `docker-compose.yml` som mocker ut Azure ved hjelp av bl.a. [mock-oauth2-server](https://github.com/navikt/mock-oauth2-server)
og [Wonderwall](https://doc.nais.io/appendix/wonderwall/), som appen er avhengig av når den kjører i miljø.

docker-compose oppsettet antar at man har [tiltakspenger-vedtak](https://github.com/navikt/tiltakspenger-vedtak) repoet 
liggende lokalt på `./../` relativt til tiltakspenger-assistent, og vil per nå bruke `Dockerfile` som ligger der for å bygge imaget til tiltakspenger-vedtak.

tiltakspenger-vedtak må bygges med gradle før Docker-imaget vil kunne bygges. `./gradlew build app:installDist` på rot av tiltakspenger-vedtak.
Etter man har gjort det skal verdikjeden kunne kjøres opp med `docker-compose up --build -d` på rot av tiltakspenger-assistent.

---

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub

## For NAV-ansatte

Interne, tekniske henvendelser kan sendes via Slack i kanalen #tpts-tech.
