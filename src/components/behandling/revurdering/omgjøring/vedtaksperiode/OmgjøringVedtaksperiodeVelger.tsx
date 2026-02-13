import {
    Datovelger,
    DatovelgerProps,
    generateMatcherProps,
} from '~/components/datovelger/Datovelger';
import { dateTilISOTekst, datoTilDatoInputText } from '~/utils/date';
import {
    useOmgjøringMedValgtResultatSkjema,
    useOmgjøringSkjemaDispatch,
} from '~/components/behandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { useRevurderingOmgjøring } from '~/components/behandling/context/BehandlingContext';
import { useSak } from '~/context/sak/SakContext';
import { finnPerioderHull, perioderOverlapper, totalPeriode } from '~/utils/periode';
import { Heading, HStack, VStack } from '@navikt/ds-react';
import { hentGjeldendeRammevedtakIPeriode, hentRammevedtak } from '~/utils/sak';
import { VedtakHjelpetekst } from '~/components/behandling/felles/layout/hjelpetekst/VedtakHjelpetekst';
import { classNames } from '~/utils/classNames';
import { VedtaksperiodevelgerGjeldendePerioder } from '~/components/behandling/revurdering/omgjøring/vedtaksperiode/gjeldende-perioder/VedtaksperiodevelgerGjeldendePerioder';
import { Omgjøring, RevurderingResultat } from '~/types/Revurdering';
import { Rammevedtak } from '~/types/Rammevedtak';
import { Periode } from '~/types/Periode';

import style from './OmgjøringVedtaksperiodeVelger.module.css';

// TODO: flytt feilhåndering til de separate komponentene for opphør og innvilgelse, ettersom ikke alle feil er relevante for begge deler

export const OmgjøringVedtaksperiodeVelger = () => {
    const { sak } = useSak();
    const { behandling } = useRevurderingOmgjøring();

    const { vedtaksperiode, erReadonly, resultat } = useOmgjøringMedValgtResultatSkjema();
    const dispatch = useOmgjøringSkjemaDispatch();

    const erOpphør = resultat === RevurderingResultat.OMGJØRING_OPPHØR;

    const vedtak = hentRammevedtak(sak, behandling.omgjørVedtak)!;

    const perioderSomKanOmgjøres = erOpphør
        ? vedtak.gjeldendeInnvilgetPerioder
        : vedtak.gjeldendeVedtaksperioder;

    const hullMellomGjeldendePerioder = finnPerioderHull(perioderSomKanOmgjøres);
    const gjeldendeVedtakHarHull = hullMellomGjeldendePerioder.length > 0;
    const harValgtMedOverlappOverHull = hullMellomGjeldendePerioder.some((hull) =>
        perioderOverlapper(hull, vedtaksperiode),
    );

    const overlappendeVedtak = hentGjeldendeRammevedtakIPeriode(sak, vedtaksperiode);
    const harValgtOmgjøringAvFlereVedtak = overlappendeVedtak.length > 1;

    const periodeSomMåOmgjøresInnenfor = gyldigTotalOmgjøringsperiode(behandling, vedtak);

    const commonProps: Partial<DatovelgerProps> = {
        readOnly: erReadonly,
        size: 'small',
        dropdownCaption: true,
        disabledMatcher: generateMatcherProps(hullMellomGjeldendePerioder),
    };

    return (
        <VStack
            gap={'space-8'}
            className={classNames(
                (harValgtMedOverlappOverHull || harValgtOmgjøringAvFlereVedtak) &&
                    style.feilPeriode,
            )}
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

            {gjeldendeVedtakHarHull && (
                <VedtakHjelpetekst variant={'warning'}>
                    {
                        'Vedtaket som omgjøres har flere gjeldende perioder. Du må velge en vedtaksperiode for omgjøring innenfor en av de gjeldende periodene.'
                    }
                </VedtakHjelpetekst>
            )}

            {harValgtMedOverlappOverHull && (
                <VedtakHjelpetekst variant={'error'}>
                    {'Valgt periode overlapper med et annet vedtak enn det som skal omgjøres.'}
                </VedtakHjelpetekst>
            )}

            {overlappendeVedtak.length > 1 && (
                <VedtakHjelpetekst variant={'error'}>
                    {`Den valgte perioden overlapper med ${overlappendeVedtak.length} vedtak. Du må velge en periode som kun overlapper med vedtaket som skal omgjøres.`}
                </VedtakHjelpetekst>
            )}
        </VStack>
    );
};

// Perioden av det gjeldende vedtaket som det er gyldig å omgjøre innenfor
// Ved innvilgelse kan vi gå utenfor denne perioden, men minst en dag må være innenfor
const gyldigTotalOmgjøringsperiode = (behandling: Omgjøring, vedtak: Rammevedtak): Periode => {
    if (!vedtak.erGjeldende || behandling.status === 'VEDTATT') {
        return behandling.vedtaksperiode!;
    }

    return behandling.resultat === RevurderingResultat.OMGJØRING_OPPHØR
        ? totalPeriode(vedtak.gjeldendeInnvilgetPerioder)
        : totalPeriode(vedtak.gjeldendeVedtaksperioder);
};
