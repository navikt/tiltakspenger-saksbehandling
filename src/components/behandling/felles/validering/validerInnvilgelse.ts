import { ValideringResultat } from '~/types/Validering';
import { validerBarnetillegg } from '~/components/behandling/felles/validering/validerBarnetillegg';
import { validerTiltaksdeltakelser } from '~/components/behandling/felles/validering/validerTiltaksdeltakelser';
import { validerAntallDagerPerMeldeperiode } from '~/components/behandling/felles/validering/validerAntallDagerPerMeldeperiode';
import { hentHeleTiltaksdeltagelsesperioden } from '~/utils/behandling';
import { Rammebehandling } from '~/types/Rammebehandling';
import { InnvilgelseState } from '~/components/behandling/context/innvilgelse/innvilgelseContext';

export const validerInnvilgelse = (
    behandling: Rammebehandling,
    innvilgelse: InnvilgelseState,
): ValideringResultat => {
    if (!innvilgelse.harValgtPeriode) {
        return {
            errors: ['Fullstendig innvilgelsesperiode må være valgt'],
            warnings: [],
        };
    }

    const validering: ValideringResultat = {
        errors: [],
        warnings: [],
    };

    const {
        innvilgelsesperiode,
        barnetilleggPerioder,
        harBarnetillegg,
        valgteTiltaksdeltakelser,
        antallDagerPerMeldeperiode,
    } = innvilgelse;

    const tiltaksperiode = hentHeleTiltaksdeltagelsesperioden(behandling);

    if (innvilgelsesperiode.fraOgMed > innvilgelsesperiode.tilOgMed) {
        validering.errors.push('Til og med-dato må være etter fra og med-dato');
    }

    if (tiltaksperiode.fraOgMed > innvilgelsesperiode.fraOgMed) {
        validering.errors.push('Innvilgelsesperioden starter før tiltaksperioden');
    }

    if (tiltaksperiode.tilOgMed < innvilgelsesperiode.tilOgMed) {
        validering.errors.push('Innvilgelsesperioden slutter etter tiltaksperioden');
    }

    if (harBarnetillegg) {
        const barnetilleggValidering = validerBarnetillegg(
            barnetilleggPerioder,
            innvilgelsesperiode,
        );
        validering.warnings.push(...barnetilleggValidering.warnings);
        validering.errors.push(...barnetilleggValidering.errors);
    }

    const tiltaksdeltagelseValidering = validerTiltaksdeltakelser(
        behandling,
        valgteTiltaksdeltakelser,
        innvilgelsesperiode,
    );
    validering.warnings.push(...tiltaksdeltagelseValidering.warnings);
    validering.errors.push(...tiltaksdeltagelseValidering.errors);

    const antallDagerPerMeldeperiodeValidering = validerAntallDagerPerMeldeperiode(
        antallDagerPerMeldeperiode,
        innvilgelsesperiode,
    );
    validering.warnings.push(...antallDagerPerMeldeperiodeValidering.warnings);
    validering.errors.push(...antallDagerPerMeldeperiodeValidering.errors);

    return validering;
};
