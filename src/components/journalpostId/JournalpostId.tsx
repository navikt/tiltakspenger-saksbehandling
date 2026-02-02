import { InlineMessage, Loader, TextField } from '@navikt/ds-react';
import React from 'react';
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
    const { control, watch, setError, clearErrors } = useFormContext();
    const journalpostIdFelt = 'journalpostId';
    const journalpostIdWatch = watch(journalpostIdFelt);

    const [debouncedJournalpostId] = useDebounce(journalpostIdWatch, DEBOUNCE_MS);
    const [datoOpprettet, setDatoOpprettet] = React.useState<string>('');

    const inneholderKunTall = (value: string) => /^[0-9]*$/.test(value);
    const journalpostId = (debouncedJournalpostId ?? '').trim();
    const shouldValidate =
        inneholderKunTall(journalpostId) && journalpostId.length >= MIN_LENGDE_FØR_VALIDERING;

    const { data, isLoading, error } = useValiderJournalpostId({
        fnr: props.fnrFraPersonopplysninger ?? '',
        journalpostId: shouldValidate ? journalpostId : '',
    });

    // Valideringsfeil som skal stoppe innsending av skjema
    React.useEffect(() => {
        const value = journalpostIdWatch?.trim() || '';
        if (!value || isLoading) return;

        // Ikke kjør remote-validering før vi har nok tegn, men la lokal
        // validering i onChange styre feilmeldingen om at feltet kun kan inneholde tall
        if (value.length < MIN_LENGDE_FØR_VALIDERING) {
            setDatoOpprettet('');
            return;
        }

        if (error) {
            setError(journalpostIdFelt, {
                type: 'remote',
                message: 'Feil ved validering av journalpostId.',
            });
            setDatoOpprettet('');
            return;
        }
        if (data) {
            if (!data.journalpostFinnes) {
                setError(journalpostIdFelt, {
                    type: 'remote',
                    message: 'Journalpost finnes ikke.',
                });
                setDatoOpprettet('');
                return;
            }

            clearErrors(journalpostIdFelt);
            setDatoOpprettet(data.datoOpprettet ?? '');
        }
    }, [journalpostIdWatch, shouldValidate, isLoading, error, data, clearErrors, setError]);

    const valideringsInfo = React.useMemo(() => {
        const value = (journalpostIdWatch ?? '').trim();
        if (!value || !props.fnrFraPersonopplysninger || !shouldValidate) return null;

        if (isLoading) {
            return (
                <>
                    <Loader size="small" /> {'Validerer…'}
                </>
            );
        }
        if (data) {
            // Skal bare advare saksbehandler om mismatch, ikke hindre innsending
            if (data.journalpostFinnes && data.gjelderInnsendtFnr) {
                return (
                    <InlineMessage status="success" aria-live="polite" size="small">
                        Journalpost finnes og søker står som avsender.
                    </InlineMessage>
                );
            }

            if (data.gjelderInnsendtFnr === false) {
                return (
                    <InlineMessage status="warning" aria-live="polite" size="small">
                        Avsenderen av journalposten er en annen person enn søker, sjekk om
                        journalposten tilhører søker eller om det er verge/fullmakt.
                    </InlineMessage>
                );
            }
        }
        return null;
    }, [journalpostIdWatch, props.fnrFraPersonopplysninger, shouldValidate, isLoading, data]);

    const fnrMatcherIkke = !!data && data.journalpostFinnes && data.gjelderInnsendtFnr === false;

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
