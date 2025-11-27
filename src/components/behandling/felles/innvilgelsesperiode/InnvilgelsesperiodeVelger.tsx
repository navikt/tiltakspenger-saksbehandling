import { dateTilISOTekst } from '~/utils/date';
import { useRolleForBehandling } from '~/context/saksbehandler/SaksbehandlerContext';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import { Rammebehandling } from '~/types/Rammebehandling';
import { VStack } from '@navikt/ds-react';
import {
    useBehandlingInnvilgelseSkjema,
    useBehandlingInnvilgelseSkjemaDispatch,
} from '~/components/behandling/context/innvilgelse/behandlingInnvilgelseContext';
import { PeriodeVelger } from '~/components/periode/PeriodeVelger';

type Props = {
    behandling: Rammebehandling;
};

export const InnvilgelsesperiodeVelger = ({ behandling }: Props) => {
    const { innvilgelsesperiode } = useBehandlingInnvilgelseSkjema();

    const dispatch = useBehandlingInnvilgelseSkjemaDispatch();

    const erIkkeSaksbehandler =
        useRolleForBehandling(behandling) !== SaksbehandlerRolle.SAKSBEHANDLER;

    return (
        <VStack gap="2">
            <PeriodeVelger
                fraOgMed={{
                    label: 'Innvilges fra og med',
                    value: innvilgelsesperiode.fraOgMed,
                    onDateChange: (valgtDato) => {
                        if (!valgtDato) {
                            return;
                        }

                        dispatch({
                            type: 'oppdaterInnvilgelsesperiode',
                            payload: { periode: { fraOgMed: dateTilISOTekst(valgtDato) } },
                        });
                    },
                }}
                tilOgMed={{
                    label: 'Innvilges til og med',
                    value: innvilgelsesperiode.tilOgMed,
                    onDateChange: (valgtDato) => {
                        if (!valgtDato) {
                            return;
                        }

                        dispatch({
                            type: 'oppdaterInnvilgelsesperiode',
                            payload: { periode: { tilOgMed: dateTilISOTekst(valgtDato) } },
                        });
                    },
                }}
                readOnly={erIkkeSaksbehandler}
            />
        </VStack>
    );
};
