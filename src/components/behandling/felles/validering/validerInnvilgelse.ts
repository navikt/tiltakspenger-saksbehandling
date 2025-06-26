import { BehandlingData } from '~/types/BehandlingTypes';
import { ValideringResultat } from '~/types/Validering';
import { validerBarnetillegg } from '~/components/behandling/felles/validering/validerBarnetillegg';
import { validerTiltaksdeltakelser } from '~/components/behandling/felles/validering/validerTiltaksdeltakelser';
import { BarnetilleggState } from '~/components/behandling/felles/state/BarnetilleggState';
import { TiltaksdeltagelseState } from '~/components/behandling/felles/state/TiltaksdeltagelseState';
import { InnvilgelseState } from '~/components/behandling/felles/state/InnvilgelseState';
import { AntallDagerForMeldeperiodeState } from '~/components/behandling/felles/state/AntallDagerState';

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

    const harFylltUtAlleNødvendigeFelter = antallDagerPerMeldeperiode.every(
        (periode) =>
            periode.antallDagerPerMeldeperiode &&
            periode.periode.fraOgMed &&
            periode.periode.tilOgMed,
    );

    if (!harFylltUtAlleNødvendigeFelter) {
        validering.errors.push('Alle felter for antall dager per meldeperiode må fylles ut');
    } else {
        antallDagerPerMeldeperiode.forEach((periode) => {
            //validert over til å være utfylt.
            if (
                periode.antallDagerPerMeldeperiode! < 1 ||
                periode.antallDagerPerMeldeperiode! > 14
            ) {
                validering.errors.push(
                    `Antall dager per meldeperiode må være mellom 1 og 14. Perioden: ${periode.periode.fraOgMed} - ${periode.periode.tilOgMed}, Antall dager: ${periode.antallDagerPerMeldeperiode}`,
                );
            }
        });
    }

    return validering;
};
