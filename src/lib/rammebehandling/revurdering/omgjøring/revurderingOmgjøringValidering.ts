import { ValideringResultat } from '~/lib/rammebehandling/typer/Validering';
import { validerInnvilgelse } from '~/lib/rammebehandling/felles/validering/validerInnvilgelse';
import { Omgjøring, RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import { OmgjøringContext } from '~/lib/rammebehandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { SakProps } from '~/lib/sak/SakTyper';
import { hentGjeldendeRammevedtak, hentVedtatteSøknadsbehandlinger } from '~/lib/sak/sakUtils';
import { perioderOverlapper, periodiseringTotalPeriode, totalPeriode } from '~/utils/periode';
import { Rammevedtak } from '~/lib/rammebehandling/typer/Rammevedtak';

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

    if (skjema.resultat === RevurderingResultat.OMGJØRING) {
        const sisteSøknad = hentVedtatteSøknadsbehandlinger(sak).at(0)!.søknad;

        const innvilgelseValidering = validerInnvilgelse(sak, behandling, skjema, sisteSøknad);

        validering.errors.push(...innvilgelseValidering.errors);
        validering.warnings.push(...innvilgelseValidering.warnings);

        if (skjema.innvilgelse.harValgtPeriode) {
            const { vedtaksperiode } = skjema;

            const innvilgelsesperiodeTotal = periodiseringTotalPeriode(
                skjema.innvilgelse.innvilgelsesperioder,
            );

            const gjeldendePeriodeTotal = totalPeriode(valgtVedtak.gjeldendeVedtaksperioder);

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

        // TODO: må skrive om håndtering av fritekst-validering litt for at dette skal fungerer intuitivt for saksbehandler
        // const måHaFritekst = skjema.valgteHjemler.some((hjemmel) =>
        //     hjemlerForOpphørSomMåHaFritekst.has(hjemmel),
        // );
        //
        // if (måHaFritekst && !skjema.textAreas.brevtekst.getValue()) {
        //     validering.errors.push('Valgt hjemmel for opphør må begrunnes med fritekst');
        // }
    }

    const vedtakSomOmgjøres = sak.tidslinje.elementer.reduce<Rammevedtak[]>(
        (acc, tidslinjeElement) => {
            const overlapper = perioderOverlapper(skjema.vedtaksperiode, tidslinjeElement.periode);

            // Tidslinja kan inneholde samme rammevedtak flere ganger dersom det er delvis omgjort
            const erDuplikat = acc.some((vedtak) => vedtak.id === tidslinjeElement.rammevedtak.id);

            if (overlapper && !erDuplikat) {
                acc.push(tidslinjeElement.rammevedtak);
            }

            return acc;
        },
        [],
    );

    if (vedtakSomOmgjøres.length > 1) {
        validering.errors.push(
            `Valgt vedtaksperiode omgjør ${vedtakSomOmgjøres.length} tidligere vedtak - Vi støtter foreløpig kun å omgjøre ett vedtak av gangen`,
        );
    } else if (vedtakSomOmgjøres.length === 0) {
        validering.errors.push('Valgt vedtaksperiode omgjør ingen tidligere vedtak');
    } else if (vedtakSomOmgjøres.at(0)!.id !== behandling.omgjørVedtak) {
        validering.errors.push(
            'Valgt vedtaksperiode omgjør perioden til et annet vedtak enn det valgte vedtaket',
        );
    }

    return validering;
};
