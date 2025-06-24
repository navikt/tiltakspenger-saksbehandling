import { Button, Heading, Select } from '@navikt/ds-react';
import { AntallDagerForMeldeperiodeFormData } from '../../behandling/felles/state/AntallDagerState';
import styles from './AntallDagerForMeldeperiodeForm.module.css';
import { Datovelger } from '~/components/datovelger/Datovelger';
import { dateTilISOTekst } from '~/utils/date';

const AntallDagerForMeldeperiodeForm = (props: {
    antallDagerPerMeldeperiode: AntallDagerForMeldeperiodeFormData[];
    behandlingsperiode: { fraOgMed: string; tilOgMed: string };
    dispatch: (action: AntallDagerForMeldeperiodeFormData[]) => void;
    erSaksbehandler: boolean;
    erIkkeSaksbehandler: boolean;
}) => {
    return (
        <div>
            <Heading size={'small'} level="4" className={styles.antallDagerHeading}>
                Antall dager per meldeperiode
            </Heading>

            <ul className={styles.antallDagerContainer}>
                {props.antallDagerPerMeldeperiode.map((periode, index) => (
                    <li
                        key={`d-${periode.antallDagerPerMeldeperiode}-f-${periode.periode.fraOgMed}-${periode.periode.tilOgMed}`}
                        className={styles.antallDagerElementContainer}
                    >
                        <Select
                            label="Antall dager"
                            size="small"
                            className={styles.antall}
                            readOnly={props.erIkkeSaksbehandler}
                            value={periode.antallDagerPerMeldeperiode ?? undefined}
                            onChange={(event) => {
                                props.dispatch([
                                    ...props.antallDagerPerMeldeperiode.slice(0, index),
                                    {
                                        ...periode,
                                        antallDagerPerMeldeperiode: Number(event.target.value),
                                    },
                                    ...props.antallDagerPerMeldeperiode.slice(index + 1),
                                ]);
                            }}
                        >
                            <option>Velg antall dager</option>
                            {Array.from({ length: 14 }).map((_, index) => {
                                const verdi = index + 1;
                                return (
                                    <option value={verdi} key={verdi}>
                                        {verdi}
                                    </option>
                                );
                            })}
                        </Select>

                        <Datovelger
                            label="Fra og med"
                            size="small"
                            minDate={props.behandlingsperiode.fraOgMed}
                            maxDate={props.behandlingsperiode.tilOgMed}
                            readOnly={props.erIkkeSaksbehandler}
                            defaultSelected={periode.periode.fraOgMed ?? undefined}
                            onDateChange={(date) => {
                                props.dispatch([
                                    ...props.antallDagerPerMeldeperiode.slice(0, index),
                                    {
                                        ...periode,
                                        periode: {
                                            ...periode.periode,
                                            fraOgMed: date ? dateTilISOTekst(date) : null,
                                        },
                                    },
                                    ...props.antallDagerPerMeldeperiode.slice(index + 1),
                                ]);
                            }}
                        />
                        <Datovelger
                            label="Til og med"
                            size="small"
                            minDate={props.behandlingsperiode.fraOgMed}
                            maxDate={props.behandlingsperiode.tilOgMed}
                            readOnly={props.erIkkeSaksbehandler}
                            defaultSelected={periode.periode.tilOgMed ?? undefined}
                            onDateChange={(date) => {
                                props.dispatch([
                                    ...props.antallDagerPerMeldeperiode.slice(0, index),
                                    {
                                        ...periode,
                                        periode: {
                                            ...periode.periode,
                                            tilOgMed: date ? dateTilISOTekst(date) : null,
                                        },
                                    },
                                    ...props.antallDagerPerMeldeperiode.slice(index + 1),
                                ]);
                            }}
                        />

                        {props.antallDagerPerMeldeperiode.length > 1 && props.erSaksbehandler && (
                            <Button
                                type="button"
                                variant="tertiary"
                                size="small"
                                onClick={() => {
                                    props.dispatch([
                                        ...props.antallDagerPerMeldeperiode.slice(0, index),
                                        ...props.antallDagerPerMeldeperiode.slice(index + 1),
                                    ]);
                                }}
                            >
                                Fjern
                            </Button>
                        )}
                    </li>
                ))}
            </ul>

            {props.erSaksbehandler && (
                <Button
                    variant="secondary"
                    type="button"
                    size="small"
                    onClick={() => {
                        props.dispatch([
                            ...props.antallDagerPerMeldeperiode,
                            {
                                antallDagerPerMeldeperiode: null,
                                periode: { fraOgMed: null, tilOgMed: null },
                            },
                        ]);
                    }}
                >
                    Ny periode
                </Button>
            )}
        </div>
    );
};

export default AntallDagerForMeldeperiodeForm;
