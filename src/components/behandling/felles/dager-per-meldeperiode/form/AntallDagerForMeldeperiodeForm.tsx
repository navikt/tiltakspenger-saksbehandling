import { Button, HStack, Select, VStack } from '@navikt/ds-react';
import { dateTilISOTekst } from '~/utils/date';
import {
    useBehandlingSkjema,
    useBehandlingSkjemaDispatch,
} from '~/components/behandling/context/BehandlingSkjemaContext';
import { useBehandling } from '~/components/behandling/context/BehandlingContext';
import { SaksbehandlerRolle } from '~/types/Saksbehandler';

import styles from './AntallDagerForMeldeperiodeForm.module.css';
import PeriodeForm from '~/components/periode/PeriodeForm';

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
            {antallDagerPerMeldeperiode.map((periode, index) => (
                <HStack gap={'5'} key={`${periode.periode?.fraOgMed}-${index}`}>
                    <PeriodeForm
                        fraOgMed={{
                            label: 'Fra og med',
                            value: periode.periode.fraOgMed ?? null,
                            onChange: (date) => {
                                if (!date) {
                                    return;
                                }

                                dispatch({
                                    type: 'oppdaterAntallDagerFraOgMed',
                                    payload: { fraOgMed: dateTilISOTekst(date), index },
                                });
                            },
                            error: null,
                        }}
                        tilOgMed={{
                            label: 'Til og med',
                            value: periode.periode.tilOgMed ?? null,
                            onChange: (date) => {
                                if (!date) {
                                    return;
                                }

                                dispatch({
                                    type: 'oppdaterAntallDagerTilOgMed',
                                    payload: { tilOgMed: dateTilISOTekst(date), index },
                                });
                            },
                            error: null,
                        }}
                        minDate={behandlingsperiode?.fraOgMed}
                        maxDate={behandlingsperiode?.tilOgMed}
                        readOnly={!erSaksbehandler}
                    />
                    <Select
                        label="Antall dager"
                        size="small"
                        readOnly={!erSaksbehandler}
                        value={periode.antallDagerPerMeldeperiode}
                        onChange={(event) => {
                            dispatch({
                                type: 'settAntallDagerForPeriode',
                                payload: { antallDager: Number(event.target.value), index },
                            });
                        }}
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
                    {antallDagerPerMeldeperiode.length > 1 && erSaksbehandler && (
                        <Button
                            className={styles.fjernMeldeperiodeKnapp}
                            type={'button'}
                            variant={'tertiary'}
                            size={'small'}
                            onClick={() => {
                                dispatch({
                                    type: 'fjernAntallDagerPeriode',
                                    payload: { index },
                                });
                            }}
                        >
                            {'Fjern periode'}
                        </Button>
                    )}
                </HStack>
            ))}
            {erSaksbehandler && (
                <Button
                    variant={'secondary'}
                    type={'button'}
                    size={'small'}
                    onClick={() => {
                        dispatch({ type: 'leggTilAntallDagerPeriode' });
                    }}
                    disabled={!kanLeggeTilNyPeriode}
                    className={styles.nyPeriodeKnapp}
                >
                    Ny periode
                </Button>
            )}
        </VStack>
    );
};
