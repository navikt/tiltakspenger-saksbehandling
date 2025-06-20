import { Datovelger } from '~/components/datovelger/Datovelger';
import { BehandlingData } from '~/types/BehandlingTypes';
import { dateTilISOTekst } from '~/utils/date';
import { classNames } from '~/utils/classNames';
import { Dispatch } from 'react';
import {
    InnvilgelseActions,
    InnvilgelseState,
} from '~/components/behandling/felles/state/InnvilgelseState';
import {
    TiltaksdeltagelseActions,
    TiltaksdeltagelseState,
} from '~/components/behandling/felles/state/TiltaksdeltagelseState';
import { useRolleForBehandling } from '~/context/saksbehandler/SaksbehandlerContext';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';

import style from './BehandlingsperiodeVelger.module.css';

type Props = {
    behandling: BehandlingData;
    dispatch: Dispatch<TiltaksdeltagelseActions | InnvilgelseActions>;
    context: TiltaksdeltagelseState & InnvilgelseState;
    label: string;
    className?: string;
};

export const BehandlingsperiodeVelger = ({
    behandling,
    dispatch,
    context,
    label,
    className,
}: Props) => {
    const { behandlingsperiode, valgteTiltaksdeltakelser } = context;

    const erIkkeSaksbehandler =
        useRolleForBehandling(behandling) !== SaksbehandlerRolle.SAKSBEHANDLER;

    return (
        <div className={classNames(style.datovelgere, className)}>
            <Datovelger
                label={`${label} fra og med`}
                size={'small'}
                defaultSelected={behandlingsperiode.fraOgMed}
                readOnly={erIkkeSaksbehandler}
                onDateChange={(valgtDato) => {
                    if (valgtDato) {
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
                    }
                }}
            />
            <Datovelger
                label={`${label} til og med`}
                size={'small'}
                defaultSelected={behandlingsperiode.tilOgMed}
                readOnly={erIkkeSaksbehandler}
                onDateChange={(valgtDato) => {
                    if (valgtDato) {
                        const isoDate = dateTilISOTekst(valgtDato);

                        dispatch({
                            type: 'oppdaterBehandlingsperiode',
                            payload: { periode: { tilOgMed: isoDate } },
                        });

                        if (valgteTiltaksdeltakelser.length === 1) {
                            dispatch({
                                type: 'oppdaterTiltakPeriode',
                                payload: { index: 0, periode: { tilOgMed: isoDate } },
                            });
                        }
                    }
                }}
            />
        </div>
    );
};
