import { Datovelger, DatovelgerProps } from '~/lib/_felles/datovelger/Datovelger';
import { dateTilISOTekst, datoTilDatoInputText } from '~/utils/date';
import {
    useOmgjøringMedValgtResultatSkjema,
    useOmgjøringSkjemaDispatch,
} from '~/lib/rammebehandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { useRevurderingOmgjøring } from '~/lib/rammebehandling/context/BehandlingContext';
import { useSak } from '~/lib/sak/SakContext';
import { nonNullish } from '~/utils/object';
import {
    finnPerioderHull,
    perioderOverlapper,
    slåSammenPerioder,
    totalPeriode,
} from '~/utils/periode';
import { Heading, HStack, VStack } from '@navikt/ds-react';
import { hentGjeldendeRammevedtakIPeriode, hentRammevedtak } from '~/lib/sak/sakUtils';
import { SakProps } from '~/lib/sak/SakTyper';
import { TidslinjeResultat } from '~/lib/_felles/tidslinjer/tidslinjeTyper';
import { VedtakHjelpetekst } from '~/lib/rammebehandling/felles/layout/hjelpetekst/VedtakHjelpetekst';
import { classNames } from '~/utils/classNames';
import { VedtaksperiodevelgerGjeldendePerioder } from '~/lib/rammebehandling/revurdering/omgjøring/vedtaksperiode/gjeldende-perioder/VedtaksperiodevelgerGjeldendePerioder';
import { Omgjøring, RevurderingResultat } from '~/lib/rammebehandling/typer/Revurdering';
import { Periode } from '~/types/Periode';

import style from './OmgjøringVedtaksperiodeVelger.module.css';

// TODO: flytt feilhåndering til de separate komponentene for opphør og innvilgelse, ettersom ikke alle feil er relevante for begge deler

export const OmgjøringVedtaksperiodeVelger = () => {
    const { sak } = useSak();
    const { behandling } = useRevurderingOmgjøring();

    const { vedtaksperiode, erReadonly, resultat } = useOmgjøringMedValgtResultatSkjema();
    const dispatch = useOmgjøringSkjemaDispatch();

    const erOpphør = resultat === RevurderingResultat.OMGJØRING_OPPHØR;

    const vedtak = nonNullish(hentRammevedtak(sak, behandling.omgjørVedtak));

    // Opphør må starte og slutte i en gjeldende innvilgelsesperiode, men kan gå over hull.
    // Innvilgelse kan gå både over hull og utenfor gjeldende perioder, så lenge minst ett vedtak omgjøres.
    const perioderSomKanOmgjøres = slåSammenPerioder(
        (erOpphør ? sak.innvilgetTidslinje : sak.tidslinje).elementer.map((it) => it.periode),
    );

    const overlappendeTidslinje = sak.tidslinje.elementer.filter((it) =>
        perioderOverlapper(it.periode, vedtaksperiode),
    );
    const overlappendeVedtak = hentGjeldendeRammevedtakIPeriode(sak, vedtaksperiode);

    const harValgtOpphørOverStansEllerOpphør =
        erOpphør &&
        overlappendeTidslinje.some(
            (it) =>
                it.tidslinjeResultat === TidslinjeResultat.STANS ||
                it.tidslinjeResultat === TidslinjeResultat.OMGJØRING_OPPHØR,
        );

    const periodeSomMåOmgjøresInnenfor = gyldigTotalOmgjøringsperiode(
        behandling,
        sak,
        perioderSomKanOmgjøres,
    );

    const commonProps: Partial<DatovelgerProps> = {
        readOnly: erReadonly,
        size: 'small',
        dropdownCaption: true,
        disabledPerioder: erOpphør ? finnPerioderHull(perioderSomKanOmgjøres) : [],
    };

    return (
        <VStack
            gap={'space-8'}
            className={classNames(harValgtOpphørOverStansEllerOpphør && style.feilPeriode)}
        >
            <Heading size={'small'} level={'3'}>
                {'Vedtaksperiode'}
            </Heading>

            <VedtaksperiodevelgerGjeldendePerioder
                vedtakSomOmgjøres={vedtak}
                valgtResultat={resultat}
                className={style.gjeldendePerioder}
            />

            <HStack gap={'space-6'} align={'end'}>
                <Datovelger
                    {...commonProps}
                    label={'Fra og med'}
                    selected={vedtaksperiode.fraOgMed}
                    value={datoTilDatoInputText(vedtaksperiode.fraOgMed)}
                    minDate={erOpphør ? perioderSomKanOmgjøres.at(0)?.fraOgMed : undefined}
                    maxDate={periodeSomMåOmgjøresInnenfor.tilOgMed}
                    defaultMonth={vedtaksperiode.fraOgMed}
                    onDateChange={(valgtDato) => {
                        if (!valgtDato) {
                            return;
                        }

                        dispatch({
                            type: 'oppdaterVedtaksperiode',
                            payload: {
                                periodeOppdatering: {
                                    fraOgMed: dateTilISOTekst(valgtDato),
                                },
                            },
                        });
                    }}
                />
                <Datovelger
                    {...commonProps}
                    label={'Til og med'}
                    selected={vedtaksperiode.tilOgMed}
                    value={datoTilDatoInputText(vedtaksperiode.tilOgMed)}
                    minDate={periodeSomMåOmgjøresInnenfor.fraOgMed}
                    maxDate={erOpphør ? perioderSomKanOmgjøres.at(-1)?.tilOgMed : undefined}
                    defaultMonth={vedtaksperiode.tilOgMed}
                    onDateChange={(valgtDato) => {
                        if (!valgtDato) {
                            return;
                        }

                        dispatch({
                            type: 'oppdaterVedtaksperiode',
                            payload: {
                                periodeOppdatering: {
                                    tilOgMed: dateTilISOTekst(valgtDato),
                                },
                            },
                        });
                    }}
                />
            </HStack>

            {overlappendeVedtak.length > 1 && (
                <VedtakHjelpetekst variant={'info'}>
                    {`Den valgte perioden omgjør ${overlappendeVedtak.length} vedtak.`}
                </VedtakHjelpetekst>
            )}

            {harValgtOpphørOverStansEllerOpphør && (
                <VedtakHjelpetekst variant={'feil'}>
                    {'Kan ikke opphøre over en periode som allerede er stanset eller opphørt.'}
                </VedtakHjelpetekst>
            )}
        </VStack>
    );
};

// Perioden det er gyldig å omgjøre innenfor, på tvers av alle gjeldende vedtak.
// Ved innvilgelse kan vi gå utenfor denne perioden, men minst en dag må være innenfor.
const gyldigTotalOmgjøringsperiode = (
    behandling: Omgjøring,
    sak: SakProps,
    perioderSomKanOmgjøres: Periode[],
): Periode => {
    const vedtak = hentRammevedtak(sak, behandling.omgjørVedtak);

    if (
        !vedtak.erGjeldende ||
        behandling.status === 'VEDTATT' ||
        perioderSomKanOmgjøres.length === 0
    ) {
        return nonNullish(behandling.vedtaksperiode);
    }

    return totalPeriode(perioderSomKanOmgjøres);
};
