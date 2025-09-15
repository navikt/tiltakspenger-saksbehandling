import { BehandlingData } from '~/types/BehandlingTypes';
import { ValideringResultat } from '~/types/Validering';
import { validerBarnetillegg } from '~/components/behandling/felles/validering/validerBarnetillegg';
import { validerTiltaksdeltakelser } from '~/components/behandling/felles/validering/validerTiltaksdeltakelser';
import { BarnetilleggState } from '~/components/behandling/felles/state/BarnetilleggState';
import { TiltaksdeltagelseState } from '~/components/behandling/felles/state/TiltaksdeltagelseState';
import { InnvilgelseState } from '~/components/behandling/felles/state/InnvilgelseState';
import { AntallDagerForMeldeperiodeState } from '~/components/behandling/felles/state/AntallDagerState';
import { validerAntallDagerPerMeldeperiode } from '~/components/behandling/felles/validering/validerAntallDagerPerMeldeperiode';

export const validerInnvilgelse = (
    behandling: BehandlingData,
    vedtak: BarnetilleggState &
        TiltaksdeltagelseState &
        InnvilgelseState &
        AntallDagerForMeldeperiodeState,
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
    } = vedtak;

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
