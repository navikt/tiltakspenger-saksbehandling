import { Button, ErrorMessage, Heading, HStack, Select, VStack } from '@navikt/ds-react';
import { AntallDagerForMeldeperiodeFormData } from '../../behandling/felles/state/AntallDagerState';
import styles from './AntallDagerForMeldeperiodeForm.module.css';
import { Datovelger } from '~/components/datovelger/Datovelger';
import { dateTilISOTekst, datoTilDatoInputText, overlapperMed } from '~/utils/date';
import { useState } from 'react';

const AntallDagerForMeldeperiodeForm = (props: {
    antallDagerPerMeldeperiode: AntallDagerForMeldeperiodeFormData[];
    behandlingsperiode: { fraOgMed: string; tilOgMed: string };
    dispatch: (action: AntallDagerForMeldeperiodeFormData[]) => void;
    erSaksbehandler: boolean;
    erIkkeSaksbehandler: boolean;
}) => {
    const [valideringsfeil, setValideringsFeil] = useState<{
        index: number;
        melding: string;
    } | null>(null);

    return (
        <div>
            <Heading size={'small'} level="4" className={styles.antallDagerHeading}>
                Antall dager per meldeperiode
            </Heading>

            <ul className={styles.antallDagerContainer}>
                {props.antallDagerPerMeldeperiode.map((periode, index) => (
                    <li
                        key={`d-${periode.antallDagerPerMeldeperiode}-f-${periode.periode.fraOgMed}-${periode.periode.tilOgMed}-${index}`}
                    >
                        <VStack gap="2">
                            <HStack gap="8">
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
                                                antallDagerPerMeldeperiode: Number(
                                                    event.target.value,
                                                ),
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
                                    value={
                                        periode.periode.fraOgMed
                                            ? datoTilDatoInputText(periode.periode.fraOgMed)
                                            : undefined
                                    }
                                    onDateChange={(date) => {
                                        const overlapperMedAndrePerioder = [
                                            ...props.antallDagerPerMeldeperiode.slice(0, index),
                                            ...props.antallDagerPerMeldeperiode.slice(index + 1),
                                        ]
                                            .filter((p) => p.periode.fraOgMed && p.periode.tilOgMed)
                                            .map((periode) => {
                                                if (!date) return false;

                                                return overlapperMed(date, {
                                                    fraOgMed: periode.periode.fraOgMed!,
                                                    tilOgMed: periode.periode.tilOgMed!,
                                                });
                                            })
                                            .some((val) => val === true);

                                        if (overlapperMedAndrePerioder) {
                                            setValideringsFeil({
                                                index,
                                                melding:
                                                    'Valgt dato vil overlappe med en anne periode. Vennligst velg en annen dato.',
                                            });
                                            return;
                                        }

                                        setValideringsFeil(null);
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
                                    value={
                                        periode.periode.tilOgMed
                                            ? datoTilDatoInputText(periode.periode.tilOgMed)
                                            : undefined
                                    }
                                    onDateChange={(date) => {
                                        const overlapperMedAndrePerioder = [
                                            ...props.antallDagerPerMeldeperiode.slice(0, index),
                                            ...props.antallDagerPerMeldeperiode.slice(index + 1),
                                        ]
                                            .filter((p) => p.periode.fraOgMed && p.periode.tilOgMed)
                                            .map((periode) => {
                                                if (!date) return false;

                                                return overlapperMed(date, {
                                                    fraOgMed: periode.periode.fraOgMed!,
                                                    tilOgMed: periode.periode.tilOgMed!,
                                                });
                                            })
                                            .some((val) => val === true);

                                        if (overlapperMedAndrePerioder) {
                                            setValideringsFeil({
                                                index,
                                                melding:
                                                    'Valgt dato vil overlappe med en anne periode. Vennligst velg en annen dato.',
                                            });
                                            return;
                                        }

                                        setValideringsFeil(null);
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

                                {props.antallDagerPerMeldeperiode.length > 1 &&
                                    props.erSaksbehandler && (
                                        <Button
                                            className={styles.fjernMeldeperiodeKnapp}
                                            type="button"
                                            variant="tertiary"
                                            size="small"
                                            onClick={() => {
                                                props.dispatch([
                                                    ...props.antallDagerPerMeldeperiode.slice(
                                                        0,
                                                        index,
                                                    ),
                                                    ...props.antallDagerPerMeldeperiode.slice(
                                                        index + 1,
                                                    ),
                                                ]);
                                            }}
                                        >
                                            Fjern meldeperiode
                                        </Button>
                                    )}
                            </HStack>
                            {valideringsfeil && valideringsfeil.index === index && (
                                <ErrorMessage size="small">{valideringsfeil.melding}</ErrorMessage>
                            )}
                        </VStack>
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
                    Ny meldeperiode
                </Button>
            )}
        </div>
    );
};

export default AntallDagerForMeldeperiodeForm;
