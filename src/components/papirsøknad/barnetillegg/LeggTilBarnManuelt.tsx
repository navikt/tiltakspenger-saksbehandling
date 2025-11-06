import React from 'react';
import styles from './LeggTilBarnManuelt.module.css';
import { Button, Heading, HStack, TextField } from '@navikt/ds-react';
import { PlusIcon } from '@navikt/aksel-icons';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { Datovelger } from '~/components/datovelger/Datovelger';
import { JaNeiSpørsmål } from '~/components/papirsøknad/JaNeiSpørsmål';
import type { Barn, Papirsøknad } from '~/components/papirsøknad/papirsøknadTypes';
import { dateTilISOTekst } from '~/utils/date';
import dayjs from 'dayjs';

const TOM_BARN_KLADD: Barn = {
    uuid: '',
    fornavn: '',
    etternavn: '',
    fødselsdato: '',
    oppholdInnenforEøs: undefined,
    manueltRegistrertBarnHarVedlegg: undefined,
};

type Props = {
    onAppend: (barn: Barn) => void;
};

export const LeggTilBarnManuelt = ({ onAppend }: Props) => {
    const {
        getValues,
        setValue,
        setError,
        clearErrors,
        formState: { errors },
    } = useFormContext<Papirsøknad>();
    const [visLeggTilBarnFelter, setVisLeggTilBarnFelt] = React.useState(false);
    const dagensDato = dayjs();

    const fornavn = 'svar.barnetilleggKladd.fornavn';
    const etternavn = 'svar.barnetilleggKladd.etternavn';
    const oppholdInnenforEøsSvar = 'svar.barnetilleggKladd.oppholdInnenforEøs.svar';
    const manueltBarnHarVedleggSvar = 'svar.barnetilleggKladd.manueltRegistrertBarnHarVedlegg.svar';
    const fødselsdato = 'svar.barnetilleggKladd.fødselsdato';
    const fornavnWatch = useWatch({ name: fornavn });
    const etternavnWatch = useWatch({ name: etternavn });
    const oppholdInnenforEøsWatch = useWatch({ name: oppholdInnenforEøsSvar });
    const manueltBarnHarVedleggWatch = useWatch({ name: manueltBarnHarVedleggSvar });
    const fødselsdatoWatch = useWatch({ name: fødselsdato });
    const fødselsdatoErFørDagensDato = dayjs(fødselsdatoWatch).isBefore(dagensDato);

    React.useEffect(() => {
        if (fornavnWatch !== undefined && fornavnWatch.trim() !== '') clearErrors(fornavn);
        if (etternavnWatch !== undefined && etternavnWatch.trim() !== '') clearErrors(etternavn);
        if (!fødselsdatoErFørDagensDato) clearErrors(fødselsdato);
        if (oppholdInnenforEøsWatch !== undefined) clearErrors(oppholdInnenforEøsSvar);
        if (fødselsdatoWatch !== undefined) clearErrors(manueltBarnHarVedleggSvar);
    }, [
        clearErrors,
        fornavnWatch,
        etternavnWatch,
        fødselsdatoWatch,
        fødselsdatoErFørDagensDato,
        oppholdInnenforEøsWatch,
        manueltBarnHarVedleggWatch,
    ]);

    // Ettersom dette er en kladd og ikke en full submit av formen må feltene sjekkes manuelt
    const validerKanLeggeTilBarn = React.useCallback(() => {
        let kanLeggeTilBarn = true;
        type FormError = { type: 'remote'; message: string };
        const formError = (message: string): FormError => {
            kanLeggeTilBarn = false;
            return { type: 'remote', message };
        };

        if (fornavnWatch === undefined || fornavnWatch.trim() === '') {
            setError(fornavn, formError('Du må fylle ut fornavn.'));
        }
        if (etternavnWatch === undefined || etternavnWatch.trim() === '') {
            setError(etternavn, formError('Du må fylle ut etternavn.'));
        }
        if (!fødselsdatoErFørDagensDato) {
            setError(fødselsdato, formError('Fødselsdato må være før dagens dato.'));
        }
        if (oppholdInnenforEøsWatch === undefined) {
            setError(oppholdInnenforEøsSvar, formError('Du må velge et svar.'));
        }
        if (manueltBarnHarVedleggWatch === undefined) {
            setError(manueltBarnHarVedleggSvar, formError('Du må velge et svar.'));
        }
        return kanLeggeTilBarn;
    }, [
        fornavnWatch,
        etternavnWatch,
        fødselsdatoErFørDagensDato,
        oppholdInnenforEøsWatch,
        manueltBarnHarVedleggWatch,
        setError,
    ]);

    const leggTilManueltBarn = () => {
        const kladd = getValues('svar.barnetilleggKladd') ?? TOM_BARN_KLADD;
        const kanLeggeTilBarn = validerKanLeggeTilBarn();
        if (!kanLeggeTilBarn) {
            return;
        }
        onAppend({ ...kladd, uuid: uuidv4() });
        skjulKladd();
    };

    const skjulKladd = React.useCallback(() => {
        setValue('svar.barnetilleggKladd', TOM_BARN_KLADD);
        clearErrors('svar.barnetilleggKladd');
        setVisLeggTilBarnFelt(false);
    }, [setValue, clearErrors]);

    return (
        <>
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
                                        error={errors.svar?.barnetilleggKladd?.fornavn?.message}
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
                                        error={errors.svar?.barnetilleggKladd?.etternavn?.message}
                                    />
                                    <Datovelger
                                        label="Fødselsdato"
                                        selected={value.fødselsdato || undefined}
                                        maxDate={dateTilISOTekst(dagensDato)}
                                        onDateChange={(date) => {
                                            const iso = date ? dateTilISOTekst(date) : '';
                                            field.onChange({
                                                ...value,
                                                fødselsdato: iso,
                                            });
                                            if (iso && dayjs(iso).isBefore(dagensDato)) {
                                                clearErrors(fødselsdato);
                                            }
                                        }}
                                        error={errors.svar?.barnetilleggKladd?.fødselsdato?.message}
                                    />
                                    <JaNeiSpørsmål
                                        name={oppholdInnenforEøsSvar}
                                        legend="Oppholder seg i EØS-land"
                                    />
                                    <JaNeiSpørsmål
                                        name={manueltBarnHarVedleggSvar}
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
        </>
    );
};
