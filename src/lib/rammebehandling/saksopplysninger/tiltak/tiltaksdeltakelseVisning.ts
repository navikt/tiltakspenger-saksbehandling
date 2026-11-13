import {
    Tiltaksdeltakelse,
    TiltaksdeltakelseKilde,
} from '~/lib/rammebehandling/typer/Tiltaksdeltakelse';
import { Periode } from '~/types/Periode';
import { Nullable } from '~/types/UtilTypes';
import { dateTilISOTekst } from '~/utils/date';
import { formaterSladdbarVerdi } from '~/utils/sladdetVerdi';
import { TiltaksdataOppslag } from './useHentTiltaksdata';

const sorterNyesteFørst = (a: Tiltaksdeltakelse, b: Tiltaksdeltakelse) => {
    const aDato = a.periode.fraOgMed ?? a.periode.tilOgMed;
    const bDato = b.periode.fraOgMed ?? b.periode.tilOgMed;

    if (aDato === bDato) {
        return 0;
    }
    if (aDato === null) {
        return 1;
    }
    if (bDato === null) {
        return -1;
    }

    return aDato > bDato ? -1 : 1;
};

const erHistorisk = (tiltak: Tiltaksdeltakelse, skillelinje: string) =>
    tiltak.periode.tilOgMed !== null && tiltak.periode.tilOgMed < skillelinje;

export const delOppTiltaksdeltakelser = (
    tiltaksdeltakelser: Tiltaksdeltakelse[],
    vurderingsperiode: Nullable<Periode>,
) => {
    const skillelinje = vurderingsperiode?.fraOgMed ?? dateTilISOTekst(new Date());
    const sortert = tiltaksdeltakelser.toSorted(sorterNyesteFørst);

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

/**
 * Hele tiltaksnavnet til deltakelsen, slik det er slått opp i kilden.
 * Vises som ukjent når deltakelsen ikke har noen tittel, f.eks. ved adressebeskyttelse.
 */
export const tiltaksnavnTekst = (
    oppslag: TiltaksdataOppslag,
    eksternDeltakelseId: string,
): string => {
    if (oppslag.isLoading) {
        return 'Henter...';
    }
    if (oppslag.error) {
        return '<henting feilet>';
    }
    const tiltaksdata = oppslag.tiltaksdata?.find(
        (data) => data.eksternDeltakelseId === eksternDeltakelseId,
    );
    return tiltaksdata
        ? formaterSladdbarVerdi(tiltaksdata.tittel, (tittel) => tittel, 'Ukjent')
        : 'Ukjent';
};
