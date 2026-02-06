import { ValideringResultat } from '~/types/Validering';
import { validerInnvilgelse } from '~/components/behandling/felles/validering/validerInnvilgelse';
import { Omgjøring, RevurderingResultat } from '~/types/Revurdering';
import { OmgjøringState } from '~/components/behandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { SakProps } from '~/types/Sak';
import { hentGjeldendeRammevedtak, hentVedtatteSøknadsbehandlinger } from '~/utils/sak';
import { perioderOverlapper, periodiseringTotalPeriode, totalPeriode } from '~/utils/periode';
import { Rammevedtak } from '~/types/Rammevedtak';

/**
 * Omgjøring benytter seg av de samme reglene som innvilgelse
 */
export const revurderingOmgjøringValidering = (
    behandling: Omgjøring,
    skjema: OmgjøringState,
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

        const innvilgelseValidering = validerInnvilgelse(
            sak,
            behandling,
            skjema.innvilgelse,
            sisteSøknad,
        );

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
