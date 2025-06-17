import { Datovelger } from '~/components/datovelger/Datovelger';
import { dateTilISOTekst } from '~/utils/date';
import { useRevurderingBehandling } from '~/components/behandling/BehandlingContext';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import {
    useRevurderingInnvilgelseSkjema,
    useRevurderingInnvilgelseSkjemaDispatch,
} from '~/components/behandling/revurdering/innvilgelse/context/RevurderingInnvilgelseVedtakContext';

export const RevurderingInnvilgelsesperiodeVelger = () => {
    const { rolleForBehandling } = useRevurderingBehandling();
    const { behandlingsperiode, valgteTiltaksdeltakelser } = useRevurderingInnvilgelseSkjema();
    const dispatch = useRevurderingInnvilgelseSkjemaDispatch();

    const erIkkeSaksbehandler = rolleForBehandling !== SaksbehandlerRolle.SAKSBEHANDLER;

    return (
        <div>
            <Datovelger
                label={'Innvilges f.o.m'}
                size={'small'}
                defaultSelected={behandlingsperiode.fraOgMed}
                readOnly={erIkkeSaksbehandler}
                onDateChange={(valgtDato) => {
                    if (!valgtDato) {
                        return;
                    }

                    const isoDate = dateTilISOTekst(valgtDato);
                    dispatch({
                        type: 'oppdaterBehandlingsperiode',
                        payload: { periode: { fraOgMed: isoDate } },
                    });
                    /**
                     * Dersom vi kun har 1 tiltak på behandlingen, så viser vi ikke tiltaksperiodene, og saksbehandler har dermed
                     * ikke mulighet til å matche tiltaksperioden med den nye innvilgelsesperioden.
                     *
                     * Derfor oppdaterer vi tiltaksperioden til å matche innvilgelsesperioden.
                     */
                    if (valgteTiltaksdeltakelser.length === 1) {
                        dispatch({
                            type: 'oppdaterTiltakPeriode',
                            payload: { index: 0, periode: { fraOgMed: isoDate } },
                        });
                    }
                }}
            />
            <Datovelger
                label={'Innvilges t.o.m'}
                size={'small'}
                defaultSelected={behandlingsperiode.tilOgMed}
                readOnly={erIkkeSaksbehandler}
                onDateChange={(valgtDato) => {
                    if (!valgtDato) {
                        return;
                    }

                    const isoDate = dateTilISOTekst(valgtDato);
                    dispatch({
                        type: 'oppdaterBehandlingsperiode',
                        payload: { periode: { tilOgMed: isoDate } },
                    });
                    /**
                     * Dersom vi kun har 1 tiltak på behandlingen, så viser vi ikke tiltaksperiodene, og saksbehandler har dermed
                     * ikke mulighet til å matche tiltaksperioden med den nye innvilgelsesperioden.
                     *
                     * Derfor oppdaterer vi tiltaksperioden til å matche innvilgelsesperioden.
                     */
                    if (valgteTiltaksdeltakelser.length === 1) {
                        dispatch({
                            type: 'oppdaterTiltakPeriode',
                            payload: { index: 0, periode: { tilOgMed: isoDate } },
                        });
                    }
                }}
            />
        </div>
    );
};
