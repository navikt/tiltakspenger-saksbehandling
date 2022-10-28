Tiltakspenger-assistent
================

Frontend-koden for støtteverktøy til bruk i saksbehandling av Tiltakspenger.

# Komme i gang

For å kjøre opp frontend i dev

```
npm install
npm run dev
```

Det er lagd et docker-compose oppsett i `docker-compose.yml` som mocker ut Azure ved hjelp av bl.a. [mock-oauth2-server](https://github.com/navikt/mock-oauth2-server)
og [Wonderwall](https://doc.nais.io/appendix/wonderwall/), som appen er avhengig av når den kjører i miljø.

docker-compose oppsettet antar at man har tiltakspenger-vedtak repoet liggende lokalt på `./../` relativt til tiltakspenger-assistent, og vil per nå bruke
`Dockerfile` som ligger der for å bygge imaget til tiltakspenger-vedtak.

Tiltakspenger-vedtak må bygges med gradle før Docker-imaget vil kunne bygges. `./gradlew build app:installDist` på rot av tiltakspenger-vedtak.
Etter man har gjort det skal verdikjeden kunne kjøres opp med `docker-compose up --build -d` på rot av tiltakspenger-assistent.

---

# Henvendelser

Spørsmål knyttet til koden eller prosjektet kan stilles som issues her på GitHub

## For NAV-ansatte

Interne, tekniske henvendelser kan sendes via Slack i kanalen #tpts-tech.