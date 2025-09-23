import { BehandlingData } from '~/types/BehandlingTypes';
import { ValideringResultat } from '~/types/Validering';
import { validerBarnetillegg } from '~/components/behandling/felles/validering/validerBarnetillegg';
import { validerTiltaksdeltakelser } from '~/components/behandling/felles/validering/validerTiltaksdeltakelser';
import { validerAntallDagerPerMeldeperiode } from '~/components/behandling/felles/validering/validerAntallDagerPerMeldeperiode';
import { BehandlingSkjemaContext } from '~/components/behandling/context/BehandlingSkjemaContext';

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
