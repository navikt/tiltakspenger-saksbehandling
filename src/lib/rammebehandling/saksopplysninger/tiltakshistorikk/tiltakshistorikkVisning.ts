import { Tiltakshistorikkinnslag } from '~/lib/rammebehandling/typer/Tiltakshistorikk';
import { Tidspunkt } from '~/types/DatoTid';

export const sorterNyesteFørst = (innslag: Tiltakshistorikkinnslag[]): Tiltakshistorikkinnslag[] =>
    innslag.toSorted((a, b) => Date.parse(b.innhentet) - Date.parse(a.innhentet));

/**
 * Innslaget som utløste behandlingen er alltid lagret etter at behandlingen ble opprettet, og regnes derfor ikke som en ny endring.
 */
export const erNyEndring = (innslag: Tiltakshistorikkinnslag, sistEndret: Tidspunkt): boolean =>
    !innslag.utløsteBehandlingen && Date.parse(innslag.innhentet) > Date.parse(sistEndret);
