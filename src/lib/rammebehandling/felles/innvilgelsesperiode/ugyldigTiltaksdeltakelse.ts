import { rammebehandlingMedInnvilgelseEllerNull } from '~/lib/rammebehandling/rammebehandlingUtils';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import {
    InnvilgelsesperiodePartial,
    UgyldigTiltaksdeltakelse,
} from '~/lib/rammebehandling/typer/Innvilgelsesperiode';
import { Nullable } from '~/types/UtilTypes';
import { formaterPeriode } from '~/utils/date';

// Tiltaksdeltakelsen valideres av backend for de lagrede innvilgelsesperiodene.
// Perioder som er endret i skjemaet, valideres først når de lagres.
export const finnUgyldigTiltaksdeltakelse = (
    behandling: Rammebehandling,
    innvilgelsesperiode: InnvilgelsesperiodePartial,
): Nullable<UgyldigTiltaksdeltakelse> => {
    const { periode, internDeltakelseId } = innvilgelsesperiode;

    const lagret = rammebehandlingMedInnvilgelseEllerNull(behandling)?.innvilgelsesperioder?.find(
        (it) =>
            it.internDeltakelseId === internDeltakelseId &&
            it.periode.fraOgMed === periode.fraOgMed &&
            it.periode.tilOgMed === periode.tilOgMed,
    );

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
