import { Select, VStack } from '@navikt/ds-react';
import { dateTilISOTekst } from '~/utils/date';
import MultiperiodeForm from '~/components/periode/MultiperiodeForm';
import {
    useBehandlingInnvilgelseMedPerioderSkjema,
    useBehandlingInnvilgelseSkjemaDispatch,
} from '~/components/behandling/context/innvilgelse/innvilgelseContext';

export const AntallDagerForMeldeperiodeForm = () => {
    const { innvilgelse, erReadonly } = useBehandlingInnvilgelseMedPerioderSkjema();
    const { innvilgelsesperiode, antallDagerPerMeldeperiode } = innvilgelse;

    const dispatch = useBehandlingInnvilgelseSkjemaDispatch();

    return (
        <VStack gap={'5'}>
            <MultiperiodeForm
                name={'antallDagerPerMeldeperiode'}
                perioder={antallDagerPerMeldeperiode}
                nyPeriodeButtonConfig={{
                    onClick: () => dispatch({ type: 'leggTilAntallDagerPeriode' }),
                    disabled: erReadonly,
                }}
                fjernPeriodeButtonConfig={{
                    onClick: (index) =>
                        dispatch({ type: 'fjernAntallDagerPeriode', payload: { index } }),
                    hidden: antallDagerPerMeldeperiode.length <= 1 || erReadonly,
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
                    minDate: innvilgelsesperiode.fraOgMed,
                    maxDate: innvilgelsesperiode.tilOgMed,
                }}
                contentConfig={{
                    content: (periode, index) => (
                        <Select
                            label="Antall dager"
                            size="small"
                            readOnly={erReadonly}
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
