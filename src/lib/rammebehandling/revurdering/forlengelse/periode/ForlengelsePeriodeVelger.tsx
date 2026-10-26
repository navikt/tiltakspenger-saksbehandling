import { BodyLong, VStack } from '@navikt/ds-react';
import { VedtakSeksjon } from '~/lib/rammebehandling/felles/layout/seksjon/VedtakSeksjon';
import { Datovelger } from '~/lib/_felles/datovelger/Datovelger';
import { dateTilISOTekst, formaterDatotekst, formaterPeriode } from '~/utils/date';
import { useSak } from '~/lib/sak/SakContext';
import { hentRammevedtak } from '~/lib/sak/sakUtils';
import { hentHeleTiltaksdeltakelsesperioden } from '~/lib/rammebehandling/rammebehandlingUtils';
import {
    hentForlengelseTilOgMed,
    useForlengelseBehandling,
    useRevurderingForlengelseSkjema,
    useRevurderingForlengelseSkjemaDispatch,
} from '~/lib/rammebehandling/context/revurdering/revurderingForlengelseSkjemaContext';

export const ForlengelsePeriodeVelger = () => {
    const { sak } = useSak();
    const behandling = useForlengelseBehandling();
    const skjema = useRevurderingForlengelseSkjema();
    const dispatch = useRevurderingForlengelseSkjemaDispatch();

    const vedtak = hentRammevedtak(sak, behandling.forlengerRammevedtakId);
    const tilOgMed = hentForlengelseTilOgMed(skjema);
    const tiltaksdeltakelsesperiode = hentHeleTiltaksdeltakelsesperioden(behandling);

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre>
                <VStack gap={'space-16'}>
                    <BodyLong size={'small'}>
                        {`Forlenger vedtaket med innvilgelse ${formaterPeriode(vedtak.opprinneligVedtaksperiode)}. `}
                        {`Forlengelsen gjelder fra og med ${formaterDatotekst(skjema.forlengesFraOgMed)}, med samme antall dager og tiltaksdeltakelse som slutten av vedtaket.`}
                    </BodyLong>
                    <Datovelger
                        label={'Forleng til og med'}
                        minDate={skjema.forlengesFraOgMed}
                        maxDate={tiltaksdeltakelsesperiode?.tilOgMed}
                        defaultMonth={new Date(tilOgMed ?? skjema.forlengesFraOgMed)}
                        defaultSelected={tilOgMed}
                        selected={tilOgMed}
                        readOnly={skjema.erReadonly}
                        onDateChange={(valgtDato) => {
                            if (!valgtDato) {
                                return;
                            }

                            dispatch({
                                type: 'settForlengelseTilOgMed',
                                payload: {
                                    tilOgMed: dateTilISOTekst(valgtDato),
                                    behandling,
                                    sak,
                                },
                            });
                        }}
                    />
                </VStack>
            </VedtakSeksjon.Venstre>
        </VedtakSeksjon>
    );
};
