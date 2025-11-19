import { Select, VStack } from '@navikt/ds-react';
import { dateTilISOTekst } from '~/utils/date';
import {
    useBehandlingSkjema,
    useBehandlingSkjemaDispatch,
} from '~/components/behandling/context/BehandlingSkjemaContext';
import { useBehandling } from '~/components/behandling/context/BehandlingContext';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';

import MultiperiodeForm from '~/components/multiperiodeForm/MultiperiodeForm';

export const AntallDagerForMeldeperiodeForm = () => {
    const { behandlingsperiode, antallDagerPerMeldeperiode } = useBehandlingSkjema();
    const dispatch = useBehandlingSkjemaDispatch();

    const { rolleForBehandling } = useBehandling();

    const erSaksbehandler = rolleForBehandling === SaksbehandlerRolle.SAKSBEHANDLER;

    const sistePeriode = antallDagerPerMeldeperiode.at(-1);

    const kanLeggeTilNyPeriode =
        !sistePeriode || sistePeriode?.periode?.fraOgMed !== sistePeriode?.periode?.tilOgMed;

    return (
        <VStack gap={'5'}>
            <MultiperiodeForm
                name={'antallDagerPerMeldeperiode'}
                perioder={antallDagerPerMeldeperiode}
                nyPeriodeButtonConfig={{
                    onClick: () => dispatch({ type: 'leggTilAntallDagerPeriode' }),
                    disabled: !kanLeggeTilNyPeriode || !erSaksbehandler,
                }}
                fjernPeriodeButtonConfig={{
                    onClick: (index) =>
                        dispatch({ type: 'fjernAntallDagerPeriode', payload: { index } }),
                    hidden: antallDagerPerMeldeperiode.length <= 1 || !erSaksbehandler,
                }}
                periodeConfig={{
                    fraOgMed: {
                        onChange: (date, index) => {
                            if (!date) {
                                return;
                            }

                            dispatch({
                                type: 'oppdaterAntallDagerFraOgMed',
                                payload: { fraOgMed: dateTilISOTekst(date), index },
                            });
                        },
                        error: null,
                    },
                    tilOgMed: {
                        onChange: (date, index) => {
                            if (!date) {
                                return;
                            }

                            dispatch({
                                type: 'oppdaterAntallDagerTilOgMed',
                                payload: { tilOgMed: dateTilISOTekst(date), index },
                            });
                        },
                        error: null,
                    },
                    minDate: behandlingsperiode?.fraOgMed,
                    maxDate: behandlingsperiode?.tilOgMed,
                }}
                contentConfig={{
                    content: (periode, index) => (
                        <Select
                            label="Antall dager"
                            size="small"
                            readOnly={!erSaksbehandler}
                            value={periode.antallDagerPerMeldeperiode}
                            onChange={(event) =>
                                dispatch({
                                    type: 'settAntallDagerForPeriode',
                                    payload: { antallDager: Number(event.target.value), index },
                                })
                            }
                        >
                            {Array.from({ length: 14 }).map((_, index) => {
                                const verdi = index + 1;
                                return (
                                    <option value={verdi} key={verdi}>
                                        {verdi}
                                    </option>
                                );
                            })}
                        </Select>
                    ),
                }}
            />
        </VStack>
    );
};
