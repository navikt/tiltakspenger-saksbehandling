import { ValideringResultat } from '~/lib/rammebehandling/typer/Validering';
import { validerBarnetillegg } from '~/lib/rammebehandling/felles/validering/validerBarnetillegg';
import { Rammebehandling } from '~/lib/rammebehandling/typer/Rammebehandling';
import { BehandlingMedInnvilgelseState } from '~/lib/rammebehandling/context/innvilgelse/innvilgelseContext';
import { hentBarnFraSøknader } from '~/lib/rammebehandling/felles/barnetillegg/utils/barnetilleggSkjemaUtils';
import {
    finnPeriodiseringHull,
    perioderOverlapper,
    periodiseringTotalPeriode,
    validerPeriodisering,
} from '~/utils/periode';
import {
    finnUgyldigTiltaksdeltakelse,
    ugyldigTiltaksdeltakelseTekst,
} from '~/lib/rammebehandling/felles/innvilgelsesperiode/ugyldigTiltaksdeltakelse';
import { SakProps } from '~/lib/sak/SakTyper';
import { finnGjeldendeInnvilgelserIPeriode } from '~/lib/rammebehandling/context/behandlingSkjemaUtils';
import { RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';

export const validerInnvilgelse = (
    sak: SakProps,
    behandling: Rammebehandling,
    skjema: BehandlingMedInnvilgelseState,
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

    const { innvilgelsesperioder, valgteBarn, harBarnetillegg } = innvilgelse;

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

    const innvilgelsesperiodeTotal = periodiseringTotalPeriode(innvilgelsesperioder);

    if (innvilgelsesperiodeTotal.fraOgMed > innvilgelsesperiodeTotal.tilOgMed) {
        validering.errors.push('Til og med-dato må være etter fra og med-dato');
    }

    innvilgelsesperioder.forEach((it) => {
        const ugyldigTiltaksdeltakelse = finnUgyldigTiltaksdeltakelse(behandling, it);

        if (ugyldigTiltaksdeltakelse) {
            validering.errors.push(ugyldigTiltaksdeltakelseTekst(ugyldigTiltaksdeltakelse));
        }
    });

    if (!skalValidereBarnetillegg) {
        return validering;
    }

    const barnetilleggValidering = validerBarnetillegg(
        harBarnetillegg,
        valgteBarn,
        innvilgelsesperioder,
        hentBarnFraSøknader(behandling, innvilgelsesperioder, sak),
    );
    validering.warnings.push(...barnetilleggValidering.warnings);
    validering.errors.push(...barnetilleggValidering.errors);

    return validering;
};
