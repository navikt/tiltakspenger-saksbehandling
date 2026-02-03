import { ValideringResultat } from '~/types/Validering';
import { validerInnvilgelse } from '~/components/behandling/felles/validering/validerInnvilgelse';
import { RevurderingOmgjøring } from '~/types/Revurdering';
import { RevurderingOmgjøringState } from '~/components/behandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { SakProps } from '~/types/Sak';
import { hentVedtatteSøknadsbehandlinger } from '~/utils/sak';
import { perioderOverlapper } from '~/utils/periode';
import { periodeTilFormatertDatotekst } from '~/utils/date';
import { Rammevedtak } from '~/types/Rammevedtak';

/**
 * Omgjøring benytter seg av de samme reglene som innvilgelse
 */
export const revurderingOmgjøringValidering = (
    behandling: RevurderingOmgjøring,
    skjema: RevurderingOmgjøringState,
    sak: SakProps,
): ValideringResultat => {
    const validering: ValideringResultat = {
        errors: [],
        warnings: [],
    };

    const sisteSøknad = hentVedtatteSøknadsbehandlinger(sak).at(0)!.søknad;

    const innvilgelseValidering = validerInnvilgelse(
        sak,
        behandling,
        skjema.innvilgelse,
        sisteSøknad,
    );

    validering.errors.push(...innvilgelseValidering.errors);
    validering.warnings.push(...innvilgelseValidering.warnings);

    const valgtVedtak = sak.tidslinje.elementer.find(
        (vedtak) => vedtak.rammevedtak.id === behandling.omgjørVedtak,
    )?.rammevedtak;

    if (!valgtVedtak) {
        validering.errors.push(
            `Fant ikke valgt vedtak som skal omgjøres: ${behandling.omgjørVedtak} - Vedtaket kan allerede være omgjort`,
        );
        return validering;
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
            `Valgte innvilgelsesperioder omgjør ${vedtakSomOmgjøres.length} tidligere vedtak - Vi støtter foreløpig kun å omgjøre ett vedtak av gangen`,
        );
    } else if (vedtakSomOmgjøres.length === 0) {
        validering.errors.push('Valgte innvilgelsesperioder omgjør ingen tidligere vedtak');
    } else if (vedtakSomOmgjøres.at(0)!.id !== behandling.omgjørVedtak) {
        const perioderSomKanOmgjøresTekst = valgtVedtak.gjeldendeVedtaksperioder
            .map((periode) => periodeTilFormatertDatotekst(periode))
            .join(', ');

        validering.errors.push(
            `Valgte innvilgelsesperioder omgjør perioden til et annet vedtak enn det valgte - må innvilge i perioden ${perioderSomKanOmgjøresTekst}`,
        );
    }

    return validering;
};
