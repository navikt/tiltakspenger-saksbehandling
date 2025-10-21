import { Datovelger } from '~/components/datovelger/Datovelger';

import { dateTilISOTekst } from '~/utils/date';
import { classNames } from '~/utils/classNames';
import { useRolleForBehandling } from '~/context/saksbehandler/SaksbehandlerContext';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import {
    useBehandlingSkjema,
    useBehandlingSkjemaDispatch,
} from '~/components/behandling/context/BehandlingSkjemaContext';

import style from './BehandlingsperiodeVelger.module.css';
import { Behandling } from '~/types/Behandling';

type Props = {
    behandling: Behandling;
    label: string;
    className?: string;
};

export const BehandlingsperiodeVelger = ({ behandling, label, className }: Props) => {
    const { behandlingsperiode } = useBehandlingSkjema();

    const dispatch = useBehandlingSkjemaDispatch();

    const erIkkeSaksbehandler =
        useRolleForBehandling(behandling) !== SaksbehandlerRolle.SAKSBEHANDLER;

    return (
        <div className={classNames(style.datovelgere, className)}>
            <Datovelger
                label={`${label} fra og med`}
                size={'small'}
                defaultSelected={behandlingsperiode?.fraOgMed}
                readOnly={erIkkeSaksbehandler}
                onDateChange={(valgtDato) => {
                    if (!valgtDato) {
                        return;
                    }

                    dispatch({
                        type: 'oppdaterBehandlingsperiode',
                        payload: { periode: { fraOgMed: dateTilISOTekst(valgtDato) } },
                    });
                }}
            />
            <Datovelger
                label={`${label} til og med`}
                size={'small'}
                defaultSelected={behandlingsperiode?.tilOgMed}
                readOnly={erIkkeSaksbehandler}
                onDateChange={(valgtDato) => {
                    if (!valgtDato) {
                        return;
                    }

                    dispatch({
                        type: 'oppdaterBehandlingsperiode',
                        payload: { periode: { tilOgMed: dateTilISOTekst(valgtDato) } },
                    });
                }}
            />
        </div>
    );
};
