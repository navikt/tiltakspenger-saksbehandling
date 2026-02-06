import { Datovelger, generateMatcherProps } from '~/components/datovelger/Datovelger';
import { dateTilISOTekst, datoMax, datoMin, datoTilDatoInputText } from '~/utils/date';
import {
    useOmgjøringMedValgtResultatSkjema,
    useOmgjøringSkjemaDispatch,
} from '~/components/behandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { useRevurderingOmgjøring } from '~/components/behandling/context/BehandlingContext';
import { useSak } from '~/context/sak/SakContext';
import { finnPerioderHull, perioderOverlapper, totalPeriode } from '~/utils/periode';
import { Heading, HStack, VStack } from '@navikt/ds-react';
import { hentGjeldendeRammevedtakIPeriode, hentRammevedtak } from '~/utils/sak';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { VedtakHjelpetekst } from '~/components/behandling/felles/layout/hjelpetekst/VedtakHjelpetekst';
import { classNames } from '~/utils/classNames';
import { VedtaksperiodeVelgerGjeldende } from '~/components/behandling/revurdering/omgjøring/vedtaksperiode/gjeldende-perioder/VedtaksperiodeVelgerGjeldende';

import style from './OmgjøringVedtaksperiodeVelger.module.css';

export const OmgjøringVedtaksperiodeVelger = () => {
    const { sak } = useSak();
    const { behandling } = useRevurderingOmgjøring();

    const { vedtaksperiode, erReadonly } = useOmgjøringMedValgtResultatSkjema();

    const dispatch = useOmgjøringSkjemaDispatch();

    const vedtak = hentRammevedtak(sak, behandling.omgjørVedtak)!;

    const gjeldendeTotalPeriode =
        // Hindrer uventet oppførsel dersom vedtaket allerede er omgjort. Kan oppstå dersom flere omgjøringer
        // for samme periode var åpne samtidig, og den ene ble iverksatt.
        vedtak.erGjeldende && behandling.status !== 'VEDTATT'
            ? totalPeriode(vedtak.gjeldendeVedtaksperioder)
            : behandling.vedtaksperiode!;

    const hullMellomGjeldendePerioder = finnPerioderHull(vedtak.gjeldendeVedtaksperioder);
    const gjeldendeVedtakHarHull = hullMellomGjeldendePerioder.length > 0;
    const harValgtMedOverlappOverHull = hullMellomGjeldendePerioder.some((hull) =>
        perioderOverlapper(hull, vedtaksperiode),
    );

    const overlappendeVedtak = hentGjeldendeRammevedtakIPeriode(sak, vedtaksperiode);
    const harValgtOmgjøringAvFlereVedtak = overlappendeVedtak.length > 1;

    const disabledMatcher = generateMatcherProps(hullMellomGjeldendePerioder);

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre>
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

                    <VedtaksperiodeVelgerGjeldende
                        gjeldendeVedtaksperioder={vedtak.gjeldendeVedtaksperioder}
                        className={style.gjeldendePerioder}
                    />

                    <HStack gap={'space-6'} align={'end'}>
                        <Datovelger
                            label={'Fra og med'}
                            selected={vedtaksperiode.fraOgMed}
                            value={datoTilDatoInputText(vedtaksperiode.fraOgMed)}
                            maxDate={datoMin(
                                vedtaksperiode.tilOgMed,
                                gjeldendeTotalPeriode.tilOgMed,
                            )}
                            defaultMonth={datoMin(new Date(), gjeldendeTotalPeriode.fraOgMed)}
                            readOnly={erReadonly}
                            size={'small'}
                            dropdownCaption={true}
                            disabledMatcher={disabledMatcher}
                            onDateChange={(valgtDato) => {
                                if (!valgtDato) {
                                    return;
                                }

                                dispatch({
                                    type: 'oppdaterVedtaksperiode',
                                    payload: {
                                        periode: { fraOgMed: dateTilISOTekst(valgtDato) },
                                    },
                                });
                            }}
                        />
                        <Datovelger
                            label={'Til og med'}
                            selected={vedtaksperiode.tilOgMed}
                            value={datoTilDatoInputText(vedtaksperiode.tilOgMed)}
                            minDate={datoMax(
                                vedtaksperiode.fraOgMed,
                                gjeldendeTotalPeriode.fraOgMed,
                            )}
                            defaultMonth={datoMin(new Date(), gjeldendeTotalPeriode.tilOgMed)}
                            readOnly={erReadonly}
                            size={'small'}
                            dropdownCaption={true}
                            disabledMatcher={disabledMatcher}
                            onDateChange={(valgtDato) => {
                                if (!valgtDato) {
                                    return;
                                }

                                dispatch({
                                    type: 'oppdaterVedtaksperiode',
                                    payload: {
                                        periode: { tilOgMed: dateTilISOTekst(valgtDato) },
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
                            {
                                'Valgt periode overlapper med et annet vedtak enn det som skal omgjøres.'
                            }
                        </VedtakHjelpetekst>
                    )}

                    {overlappendeVedtak.length > 1 && (
                        <VedtakHjelpetekst variant={'error'}>
                            {`Den valgte perioden overlapper med ${overlappendeVedtak.length} vedtak. Du må velge en periode som kun overlapper med vedtaket som skal omgjøres.`}
                        </VedtakHjelpetekst>
                    )}
                </VStack>
            </VedtakSeksjon.Venstre>
            <VedtakSeksjon.Høyre>
                <VStack gap={'space-4'}>
                    <VedtakHjelpetekst header={'Velg ny vedtaksperiode'}>
                        {'Du kan omgjøre hele eller deler av de gjeldende vedtaksperiodene.'}
                        {
                            ' Du kan også forlenge vedtaksperioden utover det opprinnelige vedtaket, så lenge det ikke overlapper med andre gjeldende vedtak.'
                        }
                    </VedtakHjelpetekst>
                </VStack>
            </VedtakSeksjon.Høyre>
        </VedtakSeksjon>
    );
};
