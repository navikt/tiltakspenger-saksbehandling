import { BodyLong, VStack } from '@navikt/ds-react';
import { VedtakSeksjon } from '~/lib/rammebehandling/felles/layout/seksjon/VedtakSeksjon';
import { Datovelger } from '~/lib/_felles/datovelger/Datovelger';
import { dateTilISOTekst, formaterDatotekst, formaterPeriode } from '~/utils/date';
import { useSak } from '~/lib/sak/SakContext';
import { hentRammevedtak } from '~/lib/sak/sakUtils';
import { hentInnvilgbarePerioder } from '~/lib/rammebehandling/rammebehandlingUtils';
import { ForlengelseTiltakVelger } from '~/lib/rammebehandling/revurdering/forlengelse/periode/ForlengelseTiltakVelger';
import {
    hentForlengelseTilOgMed,
    hentForlengelseTiltaksdeltakelse,
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
    const innvilgbarePerioder = hentInnvilgbarePerioder(behandling);
    const tiltaksdeltakelserSomKanForlenges = behandling.tiltaksdeltakelserSomKanForlenges
        .map((id) => innvilgbarePerioder.find((t) => t.internDeltakelseId === id))
        .filter((t) => t !== undefined);
    const valgtTiltaksdeltakelse = tiltaksdeltakelserSomKanForlenges.find(
        (t) => t.internDeltakelseId === hentForlengelseTiltaksdeltakelse(skjema),
    );

    return (
        <VedtakSeksjon>
            <VedtakSeksjon.Venstre>
                <VStack gap={'space-16'}>
                    <BodyLong size={'small'}>
                        {`Forlenger vedtaket med innvilgelse ${formaterPeriode(vedtak.opprinneligVedtaksperiode)}. `}
                        {`Forlengelsen gjelder fra og med ${formaterDatotekst(skjema.forlengesFraOgMed)}, med samme antall dager per meldeperiode som tiltaket sist var innvilget med i vedtaket.`}
                    </BodyLong>
                    <ForlengelseTiltakVelger
                        tiltaksdeltakelser={tiltaksdeltakelserSomKanForlenges}
                    />
                    <Datovelger
                        label={'Forleng til og med'}
                        minDate={skjema.forlengesFraOgMed}
                        maxDate={valgtTiltaksdeltakelse?.periode.tilOgMed}
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
