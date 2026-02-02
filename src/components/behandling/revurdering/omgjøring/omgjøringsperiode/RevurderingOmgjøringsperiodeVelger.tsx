import { Datovelger, generateMatcherProps } from '~/components/datovelger/Datovelger';
import { dateTilISOTekst, datoMin, datoTilDatoInputText } from '~/utils/date';
import {
    useRevurderingOmgjøringSkjema,
    useRevurderingOmgjøringSkjemaDispatch,
} from '~/components/behandling/context/revurdering/revurderingOmgjøringSkjemaContext';
import { useRevurderingOmgjøring } from '~/components/behandling/context/BehandlingContext';
import { useSak } from '~/context/sak/SakContext';
import { finnPerioderHull, perioderOverlapper, totalPeriode } from '~/utils/periode';
import { Checkbox, Heading, HStack, VStack } from '@navikt/ds-react';
import { hentRammevedtak } from '~/utils/sak';
import { VedtakSeksjon } from '~/components/behandling/felles/layout/seksjon/VedtakSeksjon';
import { VedtakHjelpetekst } from '~/components/behandling/felles/layout/hjelpetekst/VedtakHjelpetekst';
import { classNames } from '~/utils/classNames';

import style from './RevurderingOmgjøringsperiodeVelger.module.css';

export const RevurderingOmgjøringsperiodeVelger = () => {
    const { sak } = useSak();
    const { behandling } = useRevurderingOmgjøring();

    const { omgjøring, erReadonly } = useRevurderingOmgjøringSkjema();
    const { periode: valgtPeriode, skalOmgjøreHeleVedtaket } = omgjøring;

    const dispatch = useRevurderingOmgjøringSkjemaDispatch();

    const vedtak = hentRammevedtak(sak, behandling.omgjørVedtak)!;
    const gjeldendeTotalPeriode = totalPeriode(vedtak.gjeldendeVedtaksperioder);

    const defaultDato = datoMin(new Date(), gjeldendeTotalPeriode.tilOgMed);

    const hullMellomGjeldendePerioder = finnPerioderHull(vedtak.gjeldendeVedtaksperioder);
    const gjeldendeVedtakHarHull = hullMellomGjeldendePerioder.length > 0;
    const harValgtMedOverlappOverHull = hullMellomGjeldendePerioder.some((hull) =>
        perioderOverlapper(hull, valgtPeriode),
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
                        {'Omgjøringsperiode'}
                    </Heading>
                    <HStack gap={'space-6'} align={'end'}>
                        <Datovelger
                            label={'Fra og med'}
                            selected={valgtPeriode.fraOgMed}
                            value={datoTilDatoInputText(valgtPeriode.fraOgMed)}
                            minDate={gjeldendeTotalPeriode.fraOgMed}
                            maxDate={valgtPeriode.tilOgMed}
                            defaultMonth={defaultDato}
                            readOnly={erReadonly || skalOmgjøreHeleVedtaket}
                            size={'small'}
                            dropdownCaption={true}
                            disabledMatcher={disabledMatcher}
                            onDateChange={(valgtDato) => {
                                if (!valgtDato) {
                                    return;
                                }

                                dispatch({
                                    type: 'oppdaterOmgjøringsperiode',
                                    payload: {
                                        periode: { fraOgMed: dateTilISOTekst(valgtDato) },
                                    },
                                });
                            }}
                        />
                        <Datovelger
                            label={'Til og med'}
                            selected={valgtPeriode.tilOgMed}
                            value={datoTilDatoInputText(valgtPeriode.tilOgMed)}
                            minDate={valgtPeriode.fraOgMed}
                            maxDate={gjeldendeTotalPeriode.tilOgMed}
                            defaultMonth={defaultDato}
                            readOnly={erReadonly || skalOmgjøreHeleVedtaket}
                            size={'small'}
                            dropdownCaption={true}
                            disabledMatcher={disabledMatcher}
                            onDateChange={(valgtDato) => {
                                if (!valgtDato) {
                                    return;
                                }

                                dispatch({
                                    type: 'oppdaterOmgjøringsperiode',
                                    payload: {
                                        periode: { tilOgMed: dateTilISOTekst(valgtDato) },
                                    },
                                });
                            }}
                        />
                        {!gjeldendeVedtakHarHull && (
                            <Checkbox
                                readOnly={erReadonly}
                                checked={skalOmgjøreHeleVedtaket}
                                size={'small'}
                                onChange={(e) => {
                                    const { checked } = e.target;

                                    dispatch({
                                        type: 'setSkalOmgjøreHeleVedtaket',
                                        payload: {
                                            skalOmgjøreHeleVedtaket: checked,
                                            gjeldendePeriode: gjeldendeTotalPeriode,
                                        },
                                    });
                                }}
                            >
                                {'Omgjør hele vedtaket'}
                            </Checkbox>
                        )}
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
                                'Vedtaket som omgjøres har flere gjeldende perioder. Du må velge en omgjøringsperiode innenfor en av de gjeldende periodene.'
                            }
                        </VedtakHjelpetekst>
                    )}
                </VStack>
            </VedtakSeksjon.Venstre>
            <VedtakSeksjon.Høyre>
                <VStack gap={'space-4'}>
                    <VedtakHjelpetekst>
                        {'Velg perioden av det opprinnelige vedtaket som skal omgjøres. Du kan forlenge innvilgelsesperiodene utover det opprinnelige vedtaket, ' +
                            'så lenge det ikke overlapper med andre gjeldende vedtak.'}
                    </VedtakHjelpetekst>
                </VStack>
            </VedtakSeksjon.Høyre>
        </VedtakSeksjon>
    );
};
