import { ValideringResultat } from '~/lib/rammebehandling/typer/Validering';
import { validerInnvilgelse } from '~/lib/rammebehandling/felles/validering/validerInnvilgelse';
import { Omgjøring, RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import { OmgjøringContext } from '~/lib/rammebehandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { SakProps } from '~/lib/sak/SakTyper';
import { hentGjeldendeRammevedtak, hentVedtatteSøknadsbehandlinger } from '~/lib/sak/sakUtils';
import { perioderOverlapper, periodiseringTotalPeriode, totalPeriode } from '~/utils/periode';
import { TidslinjeResultat } from '~/lib/_felles/tidslinjer/tidslinjeTyper';

/**
 * Omgjøring benytter seg av de samme reglene som innvilgelse
 */
export const revurderingOmgjøringValidering = (
    behandling: Omgjøring,
    skjema: OmgjøringContext,
    sak: SakProps,
): ValideringResultat => {
    const validering: ValideringResultat = {
        errors: [],
        warnings: [],
    };

    const valgtVedtak = hentGjeldendeRammevedtak(sak, behandling.omgjørVedtak);

    if (!valgtVedtak) {
        validering.errors.push(
            `Fant ikke valgt vedtak som skal omgjøres: ${behandling.omgjørVedtak} - Vedtaket kan allerede være omgjort`,
        );
        return validering;
    }

    if (skjema.resultat === RevurderingResultat.OMGJØRING_IKKE_VALGT) {
        return validering;
    }

    // En omgjøring kan omgjøre flere vedtak, og omgjør alle gjeldende vedtak som overlapper vedtaksperioden.
    const omgjortTidslinje = sak.tidslinje.elementer.filter((element) =>
        perioderOverlapper(skjema.vedtaksperiode, element.periode),
    );

    if (omgjortTidslinje.length === 0) {
        validering.errors.push('Valgt vedtaksperiode omgjør ingen tidligere vedtak');
        return validering;
    }

    if (skjema.resultat === RevurderingResultat.OMGJØRING) {
        const sisteSøknad = hentVedtatteSøknadsbehandlinger(sak).atNonNull(0).søknad;

        const innvilgelseValidering = validerInnvilgelse(sak, behandling, skjema, sisteSøknad);

        validering.errors.push(...innvilgelseValidering.errors);
        validering.warnings.push(...innvilgelseValidering.warnings);

        if (skjema.innvilgelse.harValgtPeriode) {
            const { vedtaksperiode } = skjema;

            const innvilgelsesperiodeTotal = periodiseringTotalPeriode(
                skjema.innvilgelse.innvilgelsesperioder,
            );

            const gjeldendePeriodeTotal = totalPeriode(
                omgjortTidslinje.map((element) => element.periode),
            );

            if (
                vedtaksperiode.fraOgMed < gjeldendePeriodeTotal.fraOgMed &&
                innvilgelsesperiodeTotal.fraOgMed > vedtaksperiode.fraOgMed
            ) {
                validering.errors.push(
                    'Dersom ny vedtaksperiode starter før gjeldende vedtaksperiode, må det innvilges fra samme dato.',
                );
            }

            if (
                vedtaksperiode.tilOgMed > gjeldendePeriodeTotal.tilOgMed &&
                innvilgelsesperiodeTotal.tilOgMed < vedtaksperiode.tilOgMed
            ) {
                validering.errors.push(
                    'Dersom ny vedtaksperiode slutter etter gjeldende vedtaksperiode, må det innvilges til samme dato.',
                );
            }
        }
    }

    if (skjema.resultat === RevurderingResultat.OMGJØRING_OPPHØR) {
        if (skjema.valgteHjemler.length === 0) {
            validering.errors.push('Må velge en hjemmel for opphør');
        }

        const overlapperStansEllerOpphør = omgjortTidslinje.some(
            (element) =>
                element.tidslinjeResultat === TidslinjeResultat.STANS ||
                element.tidslinjeResultat === TidslinjeResultat.OMGJØRING_OPPHØR,
        );

        if (overlapperStansEllerOpphør) {
            validering.errors.push(
                'Kan ikke opphøre over en periode som allerede er stanset eller opphørt',
            );
        }

        // TODO: må skrive om håndtering av fritekst-validering litt for at dette skal fungerer intuitivt for saksbehandler
        // const måHaFritekst = skjema.valgteHjemler.some((hjemmel) =>
        //     hjemlerForOpphørSomMåHaFritekst.has(hjemmel),
        // );
        //
        // if (måHaFritekst && !skjema.textAreas.brevtekst.getValue()) {
        //     validering.errors.push('Valgt hjemmel for opphør må begrunnes med fritekst');
        // }
    }

    return validering;
};
