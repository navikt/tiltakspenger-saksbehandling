import { Tiltaksdeltakelse } from '~/lib/rammebehandling/typer/Tiltaksdeltakelse';
import { Periode } from '~/types/Periode';
import { Nullable } from '~/types/UtilTypes';
import { dateTilISOTekst } from '~/utils/date';

const sorterNyesteFørst = (a: Tiltaksdeltakelse, b: Tiltaksdeltakelse) => {
    const aDato = a.deltagelseFraOgMed ?? a.deltagelseTilOgMed;
    const bDato = b.deltagelseFraOgMed ?? b.deltagelseTilOgMed;

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
    tiltak.deltagelseTilOgMed !== null && tiltak.deltagelseTilOgMed < skillelinje;

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
