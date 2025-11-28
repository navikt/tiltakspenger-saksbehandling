import { dateTilISOTekst } from '~/utils/date';
import { useRolleForBehandling } from '~/context/saksbehandler/SaksbehandlerContext';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';
import { Rammebehandling } from '~/types/Rammebehandling';
import { VStack } from '@navikt/ds-react';
import {
    useBehandlingInnvilgelseSkjemaDispatch,
    useBehandlingInnvilgelseSkjema,
} from '~/components/behandling/context/innvilgelse/innvilgelseContext';
import { PeriodeVelger } from '~/components/periode/PeriodeVelger';
import { hentHeleTiltaksdeltagelsesperioden } from '~/utils/behandling';
import { useSak } from '~/context/sak/SakContext';

type Props = {
    behandling: Rammebehandling;
};

export const InnvilgelsesperiodeVelger = ({ behandling }: Props) => {
    const { sak } = useSak();
    const { innvilgelsesperiode } = useBehandlingInnvilgelseSkjema().innvilgelse;

    const dispatch = useBehandlingInnvilgelseSkjemaDispatch();

    const erIkkeSaksbehandler =
        useRolleForBehandling(behandling) !== SaksbehandlerRolle.SAKSBEHANDLER;

    const tiltaksdeltagelsesperiode = hentHeleTiltaksdeltagelsesperioden(behandling);

    return (
        <VStack gap="2">
            <PeriodeVelger
                fraOgMed={{
                    label: 'Innvilges fra og med',
                    value: innvilgelsesperiode.fraOgMed,
                    minDate: tiltaksdeltagelsesperiode.fraOgMed,
                    maxDate: innvilgelsesperiode.tilOgMed ?? tiltaksdeltagelsesperiode.tilOgMed,
                    onDateChange: (valgtDato) => {
                        if (!valgtDato) {
                            return;
                        }

                        dispatch({
                            type: 'oppdaterInnvilgelsesperiode',
                            payload: {
                                periode: { fraOgMed: dateTilISOTekst(valgtDato) },
                                behandling,
                                sak,
                            },
                        });
                    },
                }}
                tilOgMed={{
                    label: 'Innvilges til og med',
                    value: innvilgelsesperiode.tilOgMed,
                    minDate: innvilgelsesperiode.fraOgMed ?? tiltaksdeltagelsesperiode.fraOgMed,
                    maxDate: tiltaksdeltagelsesperiode.tilOgMed,
                    onDateChange: (valgtDato) => {
                        if (!valgtDato) {
                            return;
                        }

                        dispatch({
                            type: 'oppdaterInnvilgelsesperiode',
                            payload: {
                                periode: { tilOgMed: dateTilISOTekst(valgtDato) },
                                behandling,
                                sak,
                            },
                        });
                    },
                }}
                readOnly={erIkkeSaksbehandler}
            />
        </VStack>
    );
};
