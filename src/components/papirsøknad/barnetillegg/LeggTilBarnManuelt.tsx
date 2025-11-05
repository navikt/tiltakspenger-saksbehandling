import React from 'react';
import styles from './LeggTilBarnManuelt.module.css';
import { Button, Heading, HStack, TextField } from '@navikt/ds-react';
import { PlusIcon } from '@navikt/aksel-icons';
import { Controller, useFormContext } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { Datovelger } from '~/components/datovelger/Datovelger';
import { JaNeiSpørsmål } from '~/components/papirsøknad/JaNeiSpørsmål';
import type { Barn, Papirsøknad } from '~/components/papirsøknad/papirsøknadTypes';
import { dateTilISOTekst } from '~/utils/date';

type Props = {
    onAppend: (barn: Barn) => void;
};

export const LeggTilBarnManuelt = ({ onAppend }: Props) => {
    const { getValues, setValue } = useFormContext<Papirsøknad>();
    const [visLeggTilBarnFelter, setVisLeggTilBarnFelt] = React.useState(false);

    const emptyKladd = {
        fornavn: '',
        etternavn: '',
        fødselsdato: '',
        oppholdInnenforEøs: undefined,
        uuid: '',
        manueltRegistrertBarnHarVedlegg: undefined,
    };

    const leggTilManueltBarn = () => {
        const existingKladd = getValues('svar.barnetilleggKladd') ?? emptyKladd;
        const kladd = {
            ...existingKladd,
            uuid: uuidv4(),
        };
        onAppend(kladd);
        skjulKladd();
    };

    const skjulKladd = () => {
        setValue('svar.barnetilleggKladd', emptyKladd);
        setVisLeggTilBarnFelt(false);
    };

    return (
        <div>
            <Button
                type="button"
                onClick={() => setVisLeggTilBarnFelt(true)}
                className={styles.leggTilBarnButton}
                variant="secondary"
                icon={<PlusIcon aria-hidden />}
                hidden={visLeggTilBarnFelter}
            >
                Legg til barn
            </Button>

            {visLeggTilBarnFelter && (
                <div className={styles.blokk}>
                    <Heading size="small" level="4" spacing>
                        Legg til barn manuelt
                    </Heading>
                    <Controller
                        name={`svar.barnetilleggKladd`}
                        render={({ field }) => {
                            const value = field.value ?? {
                                fornavn: '',
                                etternavn: '',
                                fødselsdato: '',
                                oppholdInnenforEøs: undefined,
                                uuid: '',
                            };
                            return (
                                <div>
                                    <TextField
                                        label="Fornavn"
                                        value={value.fornavn ?? ''}
                                        onChange={(e) =>
                                            field.onChange({
                                                ...value,
                                                fornavn: e.target.value,
                                            })
                                        }
                                    />
                                    <TextField
                                        label="Etternavn"
                                        value={value.etternavn ?? ''}
                                        onChange={(e) =>
                                            field.onChange({
                                                ...value,
                                                etternavn: e.target.value,
                                            })
                                        }
                                    />
                                    <Datovelger
                                        label="Fødselsdato"
                                        selected={value.fødselsdato || undefined}
                                        onDateChange={(date) =>
                                            field.onChange({
                                                ...value,
                                                fødselsdato: date ? dateTilISOTekst(date) : '',
                                            })
                                        }
                                    />
                                    <JaNeiSpørsmål
                                        name="svar.barnetilleggKladd.oppholdInnenforEøs.svar"
                                        legend="Oppholder seg i EØS-land"
                                    />
                                    <JaNeiSpørsmål
                                        name="svar.barnetilleggKladd.manueltRegistrertBarnHarVedlegg.svar"
                                        legend="Det er vedlagt dokumentasjon for barnet"
                                        måVæreBesvart
                                    />
                                </div>
                            );
                        }}
                    />

                    <HStack gap="4">
                        <Button
                            className={styles.avbrytButton}
                            type="button"
                            variant="secondary"
                            onClick={skjulKladd}
                        >
                            Avbryt
                        </Button>

                        <Button type="button" variant="primary" onClick={leggTilManueltBarn}>
                            Legg til barn
                        </Button>
                    </HStack>
                </div>
            )}
        </div>
    );
};
