import { Datovelger, generateMatcherProps } from '~/components/datovelger/Datovelger';
import { dateTilISOTekst, datoMin, datoTilDatoInputText } from '~/utils/date';
import {
    useRevurderingOmgjøringSkjema,
    useRevurderingOmgjøringSkjemaDispatch,
} from '~/components/behandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { useRevurderingOmgjøring } from '~/components/behandling/context/BehandlingContext';
import { useSak } from '~/context/sak/SakContext';
import { finnPerioderHull, perioderOverlapper, totalPeriode } from '~/utils/periode';
import { Heading, HStack, VStack } from '@navikt/ds-react';
import { hentRammevedtak } from '~/utils/sak';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { VedtakHjelpetekst } from '~/components/behandling/felles/layout/hjelpetekst/VedtakHjelpetekst';
import { classNames } from '~/utils/classNames';

import style from './VedtaksperiodeVelger.module.css';

export const VedtaksperiodeVelger = () => {
    const { sak } = useSak();
    const { behandling } = useRevurderingOmgjøring();

    const { vedtaksperiode, erReadonly } = useRevurderingOmgjøringSkjema();

    const dispatch = useRevurderingOmgjøringSkjemaDispatch();

    const vedtak = hentRammevedtak(sak, behandling.omgjørVedtak)!;
    const gjeldendeTotalPeriode = totalPeriode(vedtak.gjeldendeVedtaksperioder);

    const defaultDato = datoMin(new Date(), gjeldendeTotalPeriode.tilOgMed);

    const hullMellomGjeldendePerioder = finnPerioderHull(vedtak.gjeldendeVedtaksperioder);
    const gjeldendeVedtakHarHull = hullMellomGjeldendePerioder.length > 0;
    const harValgtMedOverlappOverHull = hullMellomGjeldendePerioder.some((hull) =>
        perioderOverlapper(hull, vedtaksperiode),
    );

    const disabledMatcher = generateMatcherProps(hullMellomGjeldendePerioder);

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre>
                <VStack
                    gap={'space-8'}
                    className={classNames(harValgtMedOverlappOverHull && style.feilPeriode)}
                >
                    <Heading size={'small'} level={'3'}>
                        {'Vedtaksperiode'}
                    </Heading>
                    <HStack gap={'space-6'} align={'end'}>
                        <Datovelger
                            label={'Fra og med'}
                            selected={vedtaksperiode.fraOgMed}
                            value={datoTilDatoInputText(vedtaksperiode.fraOgMed)}
                            minDate={gjeldendeTotalPeriode.fraOgMed}
                            maxDate={vedtaksperiode.tilOgMed}
                            defaultMonth={defaultDato}
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
                            minDate={vedtaksperiode.fraOgMed}
                            maxDate={gjeldendeTotalPeriode.tilOgMed}
                            defaultMonth={defaultDato}
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

                    {harValgtMedOverlappOverHull && (
                        <VedtakHjelpetekst variant={'error'}>
                            {
                                'Valgt periode overlapper med med et annet vedtak enn det som skal omgjøres.'
                            }
                        </VedtakHjelpetekst>
                    )}

                    {gjeldendeVedtakHarHull && (
                        <VedtakHjelpetekst variant={'warning'}>
                            {
                                'Vedtaket som omgjøres har flere gjeldende perioder. Du må velge en vedtaksperiode for omgjøring innenfor en av de gjeldende periodene.'
                            }
                        </VedtakHjelpetekst>
                    )}
                </VStack>
            </VedtakSeksjon.Venstre>
            <VedtakSeksjon.Høyre>
                <VStack gap={'space-4'}>
                    <VedtakHjelpetekst header={'Velg ny vedtaksperiode'}>
                        {'Du kan omgjøre hele eller deler av den opprinnelige vedtaksperioden.'}
                        {
                            ' Du kan også forlenge vedtaksperioden utover det opprinnelige vedtaket, så lenge det ikke overlapper med andre gjeldende vedtak.'
                        }
                    </VedtakHjelpetekst>
                </VStack>
            </VedtakSeksjon.Høyre>
        </VedtakSeksjon>
    );
};
