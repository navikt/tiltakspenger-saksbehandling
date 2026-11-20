import { Tiltakshistorikkinnslag } from '~/lib/rammebehandling/typer/Tiltakshistorikk';
import { Tidspunkt } from '~/types/DatoTid';

export const sorterNyesteFørst = (innslag: Tiltakshistorikkinnslag[]): Tiltakshistorikkinnslag[] =>
    innslag.toSorted((a, b) => Date.parse(b.innhentet) - Date.parse(a.innhentet));

/**
 * Om innslaget har relevante endringer og er innhentet etter tidspunktet.
 * Innslaget som utløste behandlingen er alltid lagret etter at behandlingen ble opprettet, og regnes derfor ikke som en ny endring.
 */
export const erNyEndring = (innslag: Tiltakshistorikkinnslag, tidspunkt: Tidspunkt): boolean =>
    !innslag.utløsteBehandlingen &&
    innslag.harRelevantEndring &&
    Date.parse(innslag.innhentet) > Date.parse(tidspunkt);

/** Innslagene for tiltaksdeltakelsen, med det nyeste først. */
export const innslagForTiltak = (
    innslag: Tiltakshistorikkinnslag[],
    internDeltakelseId: string,
): Tiltakshistorikkinnslag[] =>
    sorterNyesteFørst(innslag.filter((it) => it.internDeltakelseId === internDeltakelseId));

/**
 * Saksopplysningene er utdaterte når det nyeste innslaget har relevante endringer og er innhentet etter at de ble hentet.
 * Innslaget som utløste behandlingen lagres etter at saksopplysningene ble hentet for den, og gjør dem ikke utdaterte.
 */
export const erUtdatert = (
    innslag: Tiltakshistorikkinnslag[],
    oppslagstidspunkt: Tidspunkt,
): boolean => {
    const nyeste = sorterNyesteFørst(innslag)[0];
    return nyeste !== undefined && erNyEndring(nyeste, oppslagstidspunkt);
};
