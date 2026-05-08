import { InlineMessage, Loader, TextField } from '@navikt/ds-react';
import React, { useEffect, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useValiderJournalpostId } from './useValiderJournalpostId';
import { useDebounce } from 'use-debounce';
import styles from './JournalpostId.module.css';
import { formaterDatotekst } from '~/utils/date';
import { Nullable } from '~/types/UtilTypes';

const DEBOUNCE_MS = 500;
const MIN_LENGDE_FØR_VALIDERING = 5;

export const JournalpostId = (props: {
    className?: string;
    fnrFraPersonopplysninger: Nullable<string>;
    readonly?: boolean;
    size?: 'small' | 'medium';
}) => {
    const { control, watch, trigger } = useFormContext();
    const journalpostIdFelt = 'journalpostId';
    const journalpostIdWatch = watch(journalpostIdFelt);

    const [debouncedJournalpostId] = useDebounce(journalpostIdWatch, DEBOUNCE_MS);

    const inneholderKunTall = (value: string) => /^[0-9]*$/.test(value);
    const journalpostId = (debouncedJournalpostId ?? '').trim();
    const shouldValidate =
        inneholderKunTall(journalpostId) && journalpostId.length >= MIN_LENGDE_FØR_VALIDERING;

    const { data, isLoading, error } = useValiderJournalpostId({
        fnr: props.fnrFraPersonopplysninger ?? '',
        journalpostId: shouldValidate ? journalpostId : '',
    });

    const fnrMatcherIkke = !!data && data.journalpostFinnes && data.gjelderInnsendtFnr === false;

    // Avledet fra valideringssvaret - vises kun når journalposten faktisk finnes og tilhører søker
    const datoOpprettet =
        shouldValidate && data?.journalpostFinnes && data?.gjelderInnsendtFnr
            ? (data.datoOpprettet ?? '')
            : '';

    // RHF kjører ikke `validate`-regelen på nytt når den asynkrone SWR-responsen endrer seg
    // (bare når selve feltverdien endres), så vi trigger re-validering manuelt her.
    useEffect(() => {
        if (shouldValidate) {
            trigger(journalpostIdFelt);
        }
    }, [trigger, shouldValidate, isLoading, data, error]);

    const valideringsInfo = useMemo(() => {
        const value = (journalpostIdWatch ?? '').trim();
        if (!value || !props.fnrFraPersonopplysninger || !shouldValidate) return null;

        if (isLoading) {
            return <Loader size="small" title={'Validerer…'} />;
        }

        if (data) {
            if (data.journalpostFinnes && data.gjelderInnsendtFnr) {
                return (
                    <InlineMessage status="success" aria-live="polite" size="small">
                        Journalpost finnes og tilhører søker.
                    </InlineMessage>
                );
            }

            if (data.gjelderInnsendtFnr === undefined) {
                return (
                    <InlineMessage status="warning" aria-live="polite" size="small">
                        Klarte ikke finne ut hvem journalposten tilhører. Sjekk om journalposten
                        tilhører søker.
                    </InlineMessage>
                );
            }
        }
        return null;
    }, [journalpostIdWatch, props.fnrFraPersonopplysninger, shouldValidate, isLoading, data]);

    return (
        <div className={props.className}>
            <Controller
                name={journalpostIdFelt}
                control={control}
                rules={{
                    required: 'JournalpostId er påkrevd.',
                    pattern: {
                        value: /^\d+$/,
                        message: 'JournalpostId kan kun inneholde tall.',
                    },
                    validate: (value: string | undefined) => {
                        const trimmed = value?.trim();
                        if (!trimmed) {
                            return true;
                        }

                        if (trimmed.length < MIN_LENGDE_FØR_VALIDERING) {
                            return `JournalpostId må inneholde minst ${MIN_LENGDE_FØR_VALIDERING} tegn.`;
                        }
                        if (isLoading) {
                            return 'Validering av journalpostId pågår.';
                        }
                        if (error) {
                            return 'Feil ved validering av journalpostId.';
                        }
                        if (data?.journalpostFinnes === false) {
                            return 'Journalpost finnes ikke.';
                        }
                        if (data?.gjelderInnsendtFnr === false) {
                            return 'Journalposten tilhører en annen person enn søker.';
                        }

                        return true;
                    },
                }}
                render={({ field, fieldState }) => (
                    <div className={styles.blokk}>
                        <TextField
                            label="JournalpostId"
                            value={field.value ?? ''}
                            onChange={(e) => {
                                field.onChange(e.target.value);
                            }}
                            error={fieldState.error?.message}
                            inputMode="numeric"
                            readOnly={props.readonly}
                            size={props.size}
                        />
                        {valideringsInfo && (!fieldState.error || fnrMatcherIkke) && (
                            <div className={styles.valideringsInfo}>{valideringsInfo}</div>
                        )}
                    </div>
                )}
            />
            <div className={styles.blokk}>
                <TextField
                    label="Opprettet (fra journalpost)"
                    value={formaterDatotekst(datoOpprettet)}
                    readOnly
                    size={props.size}
                />
            </div>
        </div>
    );
};

export default JournalpostId;
