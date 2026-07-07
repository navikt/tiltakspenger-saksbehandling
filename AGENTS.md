# AGENTS.md — tiltakspenger-saksbehandling

Dette repoet følger monorepo-konvensjonene i [`../AGENTS.md`](../AGENTS.md) og TypeScript/React-frontendkonvensjonene i [`../AGENTS-frontend.md`](../AGENTS-frontend.md). Les disse først.

## Pakkehåndtering

- Repoet bruker **pnpm** (det finnes `pnpm-lock.yaml`). Bruk `pnpm add` / `pnpm remove`, ikke `npm install`.
- `devDependencies` pinnes til **eksakte versjoner** (uten `^`). Følg samme mønster når du legger til nye.
- Ikke legg til avhengigheter som ikke brukes i `src/`. Oppdater lockfilen når `package.json` endres.

## Testing

Repoet bruker Jest. Rene logikk-tester (`*.test.ts`) kjører i node-miljøet og importerer `{ test, expect } from '@jest/globals'`.

For React-komponenttester (`*.test.tsx`) med `@testing-library/react`:

- Sett jsdom-miljø **per fil** med docblocken `/** @jest-environment jsdom */` øverst — ikke endre den globale Jest-konfigurasjonen.
- Importer matchers via `@testing-library/jest-dom/jest-globals` (ikke `@testing-library/jest-dom`), slik at `toBeInTheDocument` m.fl. typer riktig sammen med `expect` fra `@jest/globals`.
- jsdom mangler `<dialog>`, som Aksel sin `Modal` bruker. Polyfill i `beforeAll`:
  `HTMLDialogElement.prototype.showModal`/`close` må settes, og `showModal` bør sette `this.open = true` slik at innholdet regnes som synlig for `getByRole`.
- Aksel `Modal` med `portal` rendres i `document.body`, ikke i `container` fra `render(...)`. Hent f.eks. `<form>` via `document.querySelector('form')`.
- `jest.mock(...)` hoister ikke pålitelig i dette oppsettet (next/jest + SWC), heller ikke via path-alias (`~/...`). Foretrekk å drive den ekte flyten: stub `global.fetch` (evt. demp forventet `console.error`) og bruk `findBy*`/`waitFor`, i stedet for å mocke hooks/moduler.

## Delte modal-komponenter

- `src/lib/_felles/modaler/avbryt/AvbrytBehandlingModal` er delt mellom flere flyter (rammebehandling, klage, meldekort). Feiltekster og titler i delte komponenter skal være **generelle**, ikke flyt-spesifikke.
- Ikke stol på `useSak()`-konteksten i delte komponenter: klageflyten bruker `KlageProvider`, ikke `SakProvider`. Send heller inn det du trenger (f.eks. `saksnummer`) som prop.
- Sett `type="submit"` eksplisitt på submit-knapper i modaler, i stedet for å lene deg på `Button`-komponentens standardverdi.

## Feilhåndtering mot API

- 404 og 409 behandles som **terminale feil**: et nytt forsøk vil aldri lykkes. Da viser vi lenke til personoversikten og lar ikke saksbehandler sende inn på nytt. Andre feil (f.eks. 500) kan prøves på nytt.
- `errorFraApiResponse` (`src/utils/fetch/fetch.ts`) beholder `res.status` også når responsen ikke kan tolkes som JSON, med en nøytral feilmelding — slik at terminal-logikken (404/409) fungerer uavhengig av body.

## Lokal testdata

- For å teste mot ekte behandlinger lokalt kan du generere testdata med scriptene i [`scripts/testdata/`](scripts/testdata/). Kjør `./scripts/testdata/opprett-alt-digital.sh` (digital søknad) eller `./scripts/testdata/opprett-alt-papir.sh` (papirsøknad) for å opprette en sak med innvilget vedtak, en meldekortbehandling og en klagebehandling. Scriptene skriver ut et saksnummer du kan søke opp i frontend.
- Krever at `LokalMain` i `tiltakspenger-saksbehandling-api` kjører på `http://localhost:8080`.
- Full forklaring av stegene (scripts, curl og GUI fra A til Å) ligger i [`docs/opprette-behandlinger-lokalt.md`](docs/opprette-behandlinger-lokalt.md).

