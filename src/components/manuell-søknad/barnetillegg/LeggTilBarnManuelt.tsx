import React from 'react';
import styles from './LeggTilBarnManuelt.module.css';
import { Button, Heading, HStack, TextField, VStack } from '@navikt/ds-react';
import { PlusIcon } from '@navikt/aksel-icons';
import { Controller, FieldPath, useFormContext, useWatch } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { Datovelger } from '~/components/datovelger/Datovelger';
import { JaNeiSpørsmål } from '~/components/manuell-søknad/JaNeiSpørsmål';
import type {
    Barn,
    ManueltRegistrertSøknad,
} from '~/components/manuell-søknad/ManueltRegistrertSøknad';
import { dateTilISOTekst } from '~/utils/date';
import dayjs from 'dayjs';

const TOM_BARN_KLADD: Barn = {
    uuid: '',
    fornavn: '',
    etternavn: '',
    fødselsdato: '',
    erSøktBarnetilleggFor: undefined,
    oppholdInnenforEøs: undefined,
    manueltRegistrertBarnAntallVedlegg: undefined,
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
    } = useFormContext<ManueltRegistrertSøknad>();
    const [visLeggTilBarnFelter, setVisLeggTilBarnFelt] = React.useState(false);
    const dagensDato = dayjs();

    const fornavn = 'svar.barnetilleggKladd.fornavn';
    const etternavn = 'svar.barnetilleggKladd.etternavn';
    const oppholdInnenforEøsSvar = 'svar.barnetilleggKladd.oppholdInnenforEøs.svar';
    const manueltBarnAntallVedlegg = 'svar.barnetilleggKladd.manueltRegistrertBarnAntallVedlegg';
    const fødselsdato = 'svar.barnetilleggKladd.fødselsdato';
    const fornavnWatch = useWatch({ name: fornavn });
    const etternavnWatch = useWatch({ name: etternavn });
    const oppholdInnenforEøsWatch = useWatch({ name: oppholdInnenforEøsSvar });
    const manueltBarnAntallVedleggWatch = useWatch({ name: manueltBarnAntallVedlegg });
    const fødselsdatoWatch = useWatch({ name: fødselsdato });
    const fødselsdatoErFørDagensDato = dayjs(fødselsdatoWatch).isBefore(dagensDato);

    React.useEffect(() => {
        if (fornavnWatch !== undefined && fornavnWatch.trim() !== '') clearErrors(fornavn);
        if (etternavnWatch !== undefined && etternavnWatch.trim() !== '') clearErrors(etternavn);
        if (!fødselsdatoErFørDagensDato) clearErrors(fødselsdato);
        if (oppholdInnenforEøsWatch !== undefined) clearErrors(oppholdInnenforEøsSvar);
        if (manueltBarnAntallVedleggWatch !== undefined && manueltBarnAntallVedleggWatch !== '')
            clearErrors(manueltBarnAntallVedlegg);
    }, [
        clearErrors,
        fornavnWatch,
        etternavnWatch,
        fødselsdatoWatch,
        fødselsdatoErFørDagensDato,
        oppholdInnenforEøsWatch,
        manueltBarnAntallVedleggWatch,
    ]);

    // Ettersom dette er en kladd og ikke en full submit av formen må feltene sjekkes manuelt
    const validerKanLeggeTilBarn = React.useCallback(() => {
        let kanLeggeTilBarn = true;
        type Error = { type: 'remote'; message: string };
        const error = (message: string): Error => ({ type: 'remote', message });
        const validationError = (
            fieldName: FieldPath<ManueltRegistrertSøknad>,
            message: string,
        ) => {
            setError(fieldName, error(message));
            kanLeggeTilBarn = false;
        };

        if (fornavnWatch === undefined || fornavnWatch.trim() === '') {
            validationError(fornavn, 'Du må fylle ut fornavn.');
        }

        if (etternavnWatch === undefined || etternavnWatch.trim() === '') {
            validationError(etternavn, 'Du må fylle ut etternavn.');
        }

        if (!fødselsdatoErFørDagensDato) {
            validationError(fødselsdato, 'Fødselsdato må være før dagens dato.');
        }

        if (oppholdInnenforEøsWatch === undefined) {
            validationError(oppholdInnenforEøsSvar, 'Du må velge et svar.');
        }

        if (manueltBarnAntallVedleggWatch === undefined || manueltBarnAntallVedleggWatch === '') {
            validationError(
                manueltBarnAntallVedlegg,
                'Du må fylle inn antall vedlegg som dokumenterer barnet i Gosys.',
            );
        } else if (
            Number.isNaN(Number(manueltBarnAntallVedleggWatch)) ||
            Number(manueltBarnAntallVedleggWatch) < 0
        ) {
            validationError(manueltBarnAntallVedlegg, 'Antall vedlegg må være et heltall >= 0.');
        }
        return kanLeggeTilBarn;
    }, [
        fornavnWatch,
        etternavnWatch,
        fødselsdatoErFørDagensDato,
        oppholdInnenforEøsWatch,
        manueltBarnAntallVedleggWatch,
        setError,
    ]);

    const leggTilManueltBarn = () => {
        const kladd = getValues('svar.barnetilleggKladd') ?? TOM_BARN_KLADD;
        const kanLeggeTilBarn = validerKanLeggeTilBarn();
        if (!kanLeggeTilBarn) {
            return;
        }
        onAppend({ ...kladd, uuid: uuidv4(), erSøktBarnetilleggFor: { svar: 'JA' } });
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
                                <VStack gap="space-8">
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
                                    <TextField
                                        label="Antall vedlegg i Gosys som dokumenterer barnet"
                                        type="number"
                                        value={manueltBarnAntallVedleggWatch ?? ''}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            const parsed =
                                                v === '' ? '' : String(Math.max(0, Number(v)));
                                            setValue(
                                                manueltBarnAntallVedlegg,
                                                parsed === '' ? undefined : Number(parsed),
                                            );
                                        }}
                                        error={
                                            errors.svar?.barnetilleggKladd
                                                ?.manueltRegistrertBarnAntallVedlegg?.message
                                        }
                                        min={0}
                                    />
                                    <HStack gap="space-16">
                                        <Button
                                            className={styles.avbrytButton}
                                            type="button"
                                            variant="secondary"
                                            onClick={skjulKladd}
                                        >
                                            Avbryt
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="primary"
                                            onClick={leggTilManueltBarn}
                                        >
                                            Legg til barn
                                        </Button>
                                    </HStack>
                                </VStack>
                            );
                        }}
                    />
                </div>
            )}
        </>
    );
};
