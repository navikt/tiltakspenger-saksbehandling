import { ValideringResultat } from '~/lib/rammebehandling/typer/Validering';
import { validerBarnetillegg } from '~/lib/rammebehandling/felles/validering/validerBarnetillegg';
import { hentHeleTiltaksdeltakelsesperioden } from '~/lib/rammebehandling/rammebehandlingUtils';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { BehandlingMedInnvilgelseState } from '~/lib/rammebehandling/context/innvilgelse/innvilgelseContext';
import { Søknad } from '~/lib/søknad/søknadTyper';
import {
    finnPeriodiseringHull,
    perioderOverlapper,
    periodiseringTotalPeriode,
    validerPeriodisering,
} from '~/utils/periode';
import { validerTiltaksdeltakelser } from '~/lib/rammebehandling/felles/validering/validerTiltaksdeltakelser';
import { SakProps } from '~/lib/sak/SakTyper';
import { finnGjeldendeInnvilgelserIPeriode } from '~/lib/rammebehandling/context/behandlingSkjemaUtils';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';

export const validerInnvilgelse = (
    sak: SakProps,
    behandling: Rammebehandling,
    skjema: BehandlingMedInnvilgelseState,
    søknad: Søknad,
    {
        validerBarnetillegg: skalValidereBarnetillegg = true,
    }: { validerBarnetillegg?: boolean } = {},
): ValideringResultat => {
    const { innvilgelse, resultat } = skjema;

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

    if (!validerPeriodisering(innvilgelsesperioder, true)) {
        validering.errors.push('Innvilgelsesperiodene må være uten overlapp');
    }

    const hullPerioder = finnPeriodiseringHull(innvilgelsesperioder);

    const gjeldendeInnvilgelserSomOpphøres = hullPerioder.flatMap((hullPeriode) =>
        finnGjeldendeInnvilgelserIPeriode(sak, hullPeriode).filter((ip) =>
            perioderOverlapper(hullPeriode, ip),
        ),
    );

    if (gjeldendeInnvilgelserSomOpphøres.length > 0) {
        const msgPrefix = 'Valgte innvilgelsesperioder fører til et delvis opphør';

        if (resultat === RevurderingResultat.OMGJØRING) {
            validering.warnings.push(msgPrefix);
        } else {
            validering.errors.push(
                `${msgPrefix} - Vi støtter kun opphør ved omgjøring eller stans`,
            );
        }
    }

    if (!hentHeleTiltaksdeltakelsesperioden(behandling)) {
        validering.errors.push(
            'Fant ingen tiltaksdeltakelser som kan innvilges i saksopplysningene.',
        );
        return validering;
    }

    const innvilgelsesperiodeTotal = periodiseringTotalPeriode(innvilgelsesperioder);

    if (innvilgelsesperiodeTotal.fraOgMed > innvilgelsesperiodeTotal.tilOgMed) {
        validering.errors.push('Til og med-dato må være etter fra og med-dato');
    }

    // Validerer hver innvilgelsesperiode mot sin valgte tiltaksdeltakelse, som også dekker hele tiltaksperioden
    const tiltaksdeltakelserValidering = validerTiltaksdeltakelser(
        behandling,
        innvilgelsesperioder,
    );
    validering.errors.push(...tiltaksdeltakelserValidering.errors);
    validering.warnings.push(...tiltaksdeltakelserValidering.warnings);

    if (!skalValidereBarnetillegg) {
        return validering;
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
