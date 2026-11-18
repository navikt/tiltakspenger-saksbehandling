import {
    Tiltaksdeltakelse,
    TiltaksdeltakelseKilde,
} from '~/lib/rammebehandling/typer/Tiltaksdeltakelse';
import { Periode } from '~/types/Periode';
import { Nullable } from '~/types/UtilTypes';
import { dateTilISOTekst } from '~/utils/date';
import { formaterSladdbarVerdi } from '~/utils/sladdetVerdi';
import { Tiltaksdata, TiltaksdataOppslag } from './useHentTiltaksdata';

/** Stigende etter fra og med-dato. Tiltak uten fra og med-dato kommer sist. */
const sorterEtterFraOgMed = (a: Tiltaksdeltakelse, b: Tiltaksdeltakelse) => {
    const aDato = a.periode.fraOgMed;
    const bDato = b.periode.fraOgMed;

    if (aDato === bDato) {
        return 0;
    }
    if (aDato === null) {
        return 1;
    }
    if (bDato === null) {
        return -1;
    }

    return aDato < bDato ? -1 : 1;
};

const erHistorisk = (tiltak: Tiltaksdeltakelse, skillelinje: string) =>
    tiltak.periode.tilOgMed !== null && tiltak.periode.tilOgMed < skillelinje;

export const delOppTiltaksdeltakelser = (
    tiltaksdeltakelser: Tiltaksdeltakelse[],
    vurderingsperiode: Nullable<Periode>,
) => {
    const skillelinje = vurderingsperiode?.fraOgMed ?? dateTilISOTekst(new Date());
    const sortert = tiltaksdeltakelser.toSorted(sorterEtterFraOgMed);

    return {
        aktuelle: sortert.filter((tiltak) => !erHistorisk(tiltak, skillelinje)),
        historiske: sortert.filter((tiltak) => erHistorisk(tiltak, skillelinje)),
    };
};

export const prosentTekst = (prosent: number | null) => {
    return prosent !== null && prosent !== undefined ? `${prosent}%` : 'Ukjent';
};

const modiaTekst = 'Modia arbeidsrettet oppfølging';

export const kildeTekst: Record<TiltaksdeltakelseKilde, string> = {
    [TiltaksdeltakelseKilde.ARENA]: 'Arena',
    [TiltaksdeltakelseKilde.KOMET]: modiaTekst,
    [TiltaksdeltakelseKilde.TEAM_TILTAK]: modiaTekst,
} as const;

export type TiltaksdataFelt = 'tittel' | 'gjennomføringsnavn';

/**
 * Et felt fra tiltaksdataene til deltakelsen, slik det er slått opp i kilden.
 * Vises som ukjent når deltakelsen ikke har noen verdi, f.eks. ved adressebeskyttelse.
 */
export const tiltaksdataTekst = (
    oppslag: TiltaksdataOppslag,
    eksternDeltakelseId: string,
    felt: TiltaksdataFelt,
): string => {
    if (oppslag.isLoading) {
        return 'Henter...';
    }
    if (oppslag.error) {
        return '<henting feilet>';
    }
    const tiltaksdata: Tiltaksdata | undefined = oppslag.tiltaksdata?.find(
        (data) => data.eksternDeltakelseId === eksternDeltakelseId,
    );
    return tiltaksdata
        ? formaterSladdbarVerdi(tiltaksdata[felt], (verdi) => verdi, 'Ukjent')
        : 'Ukjent';
};

const maksLengdeGjennomføringsnavn = 75;
const avkortetLengdeGjennomføringsnavn = 72;

/**
 * Gjennomføringsnavnet er fritekst uten lengdegrense, så lange navn avkortes for å ikke sprenge visningen.
 * Et navn over 75 tegn kuttes til 72 tegn og avsluttes med "...".
 * `avkortet` er false når navnet vises i sin helhet.
 */
export const avkortGjennomføringsnavn = (navn: string): { visning: string; avkortet: boolean } =>
    navn.length > maksLengdeGjennomføringsnavn
        ? {
              visning: `${navn.slice(0, avkortetLengdeGjennomføringsnavn).trimEnd()}...`,
              avkortet: true,
          }
        : { visning: navn, avkortet: false };
