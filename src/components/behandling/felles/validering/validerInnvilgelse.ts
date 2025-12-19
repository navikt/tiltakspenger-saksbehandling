import { ValideringResultat } from '~/types/Validering';
import { validerBarnetillegg } from '~/components/behandling/felles/validering/validerBarnetillegg';
import { hentHeleTiltaksdeltakelsesperioden } from '~/utils/behandling';
import { Rammebehandling } from '~/types/Rammebehandling';
import { InnvilgelseState } from '~/components/behandling/context/innvilgelse/innvilgelseContext';
import { Søknad } from '~/types/Søknad';
import { periodiseringTotalPeriode, validerPeriodisering } from '~/utils/periode';

export const validerInnvilgelse = (
    behandling: Rammebehandling,
    innvilgelse: InnvilgelseState,
    søknad: Søknad,
): ValideringResultat => {
    if (!innvilgelse.harValgtPeriode) {
        return {
            errors: ['Minst en fullstendig innvilgelsesperiode må være valgt'],
            warnings: [],
        };
    }

    const validering: ValideringResultat = {
        errors: [],
        warnings: [],
    };

    const { innvilgelsesperioder, barnetilleggPerioder, harBarnetillegg } = innvilgelse;

    if (!validerPeriodisering(innvilgelsesperioder, false)) {
        validering.errors.push(
            'Innvilgelsesperiodene må være sammenhengende uten hull eller overlapp',
        );
    }

    const tiltaksperiode = hentHeleTiltaksdeltakelsesperioden(behandling);

    const innvilgelsesperiodeTotal = periodiseringTotalPeriode(innvilgelsesperioder);

    if (innvilgelsesperiodeTotal.fraOgMed > innvilgelsesperiodeTotal.tilOgMed) {
        validering.errors.push('Til og med-dato må være etter fra og med-dato');
    }

    if (tiltaksperiode.fraOgMed > innvilgelsesperiodeTotal.fraOgMed) {
        validering.errors.push('Innvilgelsesperioden starter før tiltaksperioden');
    }

    if (tiltaksperiode.tilOgMed < innvilgelsesperiodeTotal.tilOgMed) {
        validering.errors.push('Innvilgelsesperioden slutter etter tiltaksperioden');
    }

    const barnetilleggValidering = validerBarnetillegg(
        harBarnetillegg,
        barnetilleggPerioder,
        innvilgelsesperioder,
        søknad,
    );
    validering.warnings.push(...barnetilleggValidering.warnings);
    validering.errors.push(...barnetilleggValidering.errors);

    return validering;
};
