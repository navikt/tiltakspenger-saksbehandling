import { rammebehandlingMedInnvilgelseEllerNull } from '~/lib/rammebehandling/rammebehandlingUtils';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { UgyldigTiltaksdeltakelse } from '~/lib/rammebehandling/typer/Innvilgelsesperiode';
import {
    erSammeTiltak,
    TiltakNøkkel,
} from '~/lib/rammebehandling/felles/innvilgelsesperiode/innvilgelseForTiltakUtils';
import { Periode } from '~/types/Periode';
import { perioderErLike } from '~/utils/periode';
import { Nullable } from '~/types/UtilTypes';
import { formaterPeriode } from '~/utils/date';

// Tiltaksdeltakelsen valideres av backend for de lagrede innvilgelsesperiodene.
// Perioder som er endret i skjemaet, valideres først når de lagres.
// Endres bare valget av reversert opphør, er perioden også endret, siden reversert opphør ikke valideres mot tiltaksdeltakelsen.
export const finnUgyldigTiltaksdeltakelse = (
    behandling: Rammebehandling,
    tiltak: TiltakNøkkel,
    periode: Periode,
): Nullable<UgyldigTiltaksdeltakelse> => {
    const lagret = rammebehandlingMedInnvilgelseEllerNull(behandling)
        ?.innvilgelsesperioder?.tiltak.find((it) => erSammeTiltak(it, tiltak))
        ?.perioder.find((it) => perioderErLike(it.periode, periode));

    return lagret?.ugyldigTiltaksdeltakelse ?? null;
};

export const ugyldigTiltaksdeltakelseTekst = (ugyldig: UgyldigTiltaksdeltakelse): string => {
    switch (ugyldig.type) {
        case 'FINNES_IKKE':
            return 'Valgt tiltaksdeltakelse finnes ikke lenger i saksopplysningene';
        case 'KAN_IKKE_INNVILGES':
            return 'Kan ikke innvilge for valgt tiltaksdeltakelse';
        case 'DEKKER_IKKE_PERIODEN':
            return `Innvilgelsesperioden må være innenfor tiltaksdeltakelsens periode (${formaterPeriode(ugyldig.deltakelsesperiode)})`;
    }
};
