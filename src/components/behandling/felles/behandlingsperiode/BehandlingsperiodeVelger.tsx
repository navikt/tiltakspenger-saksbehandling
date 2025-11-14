import { dateTilISOTekst } from '~/utils/date';
import { useRolleForBehandling } from '~/context/saksbehandler/SaksbehandlerContext';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import {
    useBehandlingSkjema,
    useBehandlingSkjemaDispatch,
} from '~/components/behandling/context/BehandlingSkjemaContext';

import { Rammebehandling } from '~/types/Rammebehandling';
import { VStack } from '@navikt/ds-react';
import PeriodeForm from '~/components/periode/PeriodeForm';

type Props = {
    behandling: Rammebehandling;
    label: string;
};

export const BehandlingsperiodeVelger = ({ behandling, label }: Props) => {
    const { behandlingsperiode } = useBehandlingSkjema();

    const dispatch = useBehandlingSkjemaDispatch();

    const erIkkeSaksbehandler =
        useRolleForBehandling(behandling) !== SaksbehandlerRolle.SAKSBEHANDLER;

    return (
        <VStack gap="2">
            <PeriodeForm
                fraOgMed={{
                    label: `${label} fra og med`,
                    value: behandlingsperiode?.fraOgMed ?? null,
                    onChange: (valgtDato) => {
                        if (!valgtDato) {
                            return;
                        }

                        dispatch({
                            type: 'oppdaterBehandlingsperiode',
                            payload: { periode: { fraOgMed: dateTilISOTekst(valgtDato) } },
                        });
                    },
                    error: null,
                }}
                tilOgMed={{
                    label: `${label} til og med`,
                    value: behandlingsperiode?.tilOgMed ?? null,
                    onChange: (valgtDato) => {
                        if (!valgtDato) {
                            return;
                        }

                        dispatch({
                            type: 'oppdaterBehandlingsperiode',
                            payload: { periode: { tilOgMed: dateTilISOTekst(valgtDato) } },
                        });
                    },
                    error: null,
                }}
                readOnly={erIkkeSaksbehandler}
            />
        </VStack>
    );
};
