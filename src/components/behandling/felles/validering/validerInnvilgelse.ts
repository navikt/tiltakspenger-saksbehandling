import { BehandlingData } from '~/types/BehandlingTypes';
import { ValideringResultat } from '~/types/Validering';
import { validerBarnetillegg } from '~/components/behandling/felles/validering/validerBarnetillegg';
import { validerTiltaksdeltakelser } from '~/components/behandling/felles/validering/validerTiltaksdeltakelser';
import { validerAntallDagerPerMeldeperiode } from '~/components/behandling/felles/validering/validerAntallDagerPerMeldeperiode';
import { BehandlingSkjemaContext } from '~/components/behandling/context/BehandlingSkjemaContext';
import { erFullstendigPeriode } from '~/utils/periode';
import { hentHeleTiltaksdeltagelsesperioden } from '~/utils/behandling';

export const validerInnvilgelse = (
    behandling: BehandlingData,
    skjema: BehandlingSkjemaContext,
): ValideringResultat => {
    const validering: ValideringResultat = {
        errors: [],
        warnings: [],
    };

    const {
        behandlingsperiode,
        barnetilleggPerioder,
        harBarnetillegg,
        valgteTiltaksdeltakelser,
        antallDagerPerMeldeperiode,
    } = skjema;

    const tiltaksperiode = hentHeleTiltaksdeltagelsesperioden(behandling);

    if (erFullstendigPeriode(behandlingsperiode)) {
        if (behandlingsperiode.fraOgMed > behandlingsperiode.tilOgMed) {
            validering.errors.push('Til og med-dato må være etter fra og med-dato');
        }

        if (tiltaksperiode.fraOgMed > behandlingsperiode.fraOgMed) {
            validering.errors.push('Behandlingsperioden starter før tiltaksperioden');
        }

        if (tiltaksperiode.tilOgMed < behandlingsperiode.tilOgMed) {
            validering.errors.push('Behandlingsperioden slutter etter tiltaksperioden');
        }
    } else {
        validering.errors.push('Behandlingsperioden må være satt');
        return validering;
    }

    if (harBarnetillegg) {
        const barnetilleggValidering = validerBarnetillegg(
            barnetilleggPerioder,
            behandlingsperiode,
        );
        validering.warnings.push(...barnetilleggValidering.warnings);
        validering.errors.push(...barnetilleggValidering.errors);
    }

    const tiltaksdeltagelseValidering = validerTiltaksdeltakelser(
        behandling,
        valgteTiltaksdeltakelser,
        behandlingsperiode,
    );
    validering.warnings.push(...tiltaksdeltagelseValidering.warnings);
    validering.errors.push(...tiltaksdeltagelseValidering.errors);

    const antallDagerPerMeldeperiodeValidering = validerAntallDagerPerMeldeperiode(
        antallDagerPerMeldeperiode,
        behandlingsperiode,
    );
    validering.warnings.push(...antallDagerPerMeldeperiodeValidering.warnings);
    validering.errors.push(...antallDagerPerMeldeperiodeValidering.errors);

    return validering;
};
