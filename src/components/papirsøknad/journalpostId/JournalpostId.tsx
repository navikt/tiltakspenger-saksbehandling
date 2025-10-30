import { Alert, Loader, TextField } from '@navikt/ds-react';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Papirsøknad } from '~/components/papirsøknad/papirsøknadTypes';
import { useValiderJournalpostId } from './useValiderJournalpostId';
import { useDebounce } from 'use-debounce';
import styles from './JournalpostId.module.css';

const DEBOUNCE_MS = 500;
const MIN_LENGDE_FØR_VALIDERING = 3;

export const JournalpostId = () => {
    const { control, watch, setError, clearErrors } = useFormContext<Papirsøknad>();
    const journalpostIdFelt = 'journalpostId';
    const journalpostIdWatch = watch(journalpostIdFelt);
    const fnrWatch = watch('personopplysninger.ident');
    const [debouncedJournalpostId] = useDebounce(journalpostIdWatch, DEBOUNCE_MS);

    const journalpostId =
        (journalpostIdWatch?.trim().length ?? 0) >= MIN_LENGDE_FØR_VALIDERING
            ? debouncedJournalpostId
            : '';

    const { data, isLoading, error } = useValiderJournalpostId({
        fnr: fnrWatch ?? '',
        journalpostId: journalpostId ?? '',
    });

    // Valideringsfeil som skal stoppe innsending av skjema
    React.useEffect(() => {
        const value = journalpostIdWatch?.trim() || '';
        if (!value) return;
        if (value.length < MIN_LENGDE_FØR_VALIDERING) {
            clearErrors(journalpostIdFelt);
            return;
        }
        if (isLoading) return;
        if (error) {
            setError(journalpostIdFelt, {
                type: 'remote',
                message: 'Feil ved validering av journalpostId.',
            });
            return;
        }
        if (data) {
            if (!data.journalpostFinnes) {
                setError(journalpostIdFelt, {
                    type: 'remote',
                    message: 'Journalpost finnes ikke.',
                });
                return;
            }
            clearErrors('journalpostId');
        }
    }, [journalpostIdWatch, isLoading, error, data, clearErrors, setError]);

    const valideringsInfo = React.useMemo(() => {
        if (!journalpostIdWatch || !fnrWatch) return null;
        if ((journalpostIdWatch?.trim().length ?? 0) < MIN_LENGDE_FØR_VALIDERING) return null;
        if (isLoading) {
            return (
                <>
                    <Loader size="small" /> {'Validerer…'}
                </>
            );
        }
        if (data) {
            // Skal bare advare saksbehandler om mismatch, ikke hindre innsending
            if (data.gjelderInnsendtFnr === false) {
                return (
                    <Alert variant="warning" inline aria-live="polite">
                        Journalposten tilhører en annen person.
                    </Alert>
                );
            }
            return (
                <Alert variant="success" inline aria-live="polite">
                    Journalpost er gyldig.
                </Alert>
            );
        }
        return null;
    }, [journalpostIdWatch, fnrWatch, isLoading, data]);

    const fnrMatcherIkke = !!data && data.journalpostFinnes && data.gjelderInnsendtFnr === false;

    return (
        <Controller
            name={journalpostIdFelt}
            control={control}
            rules={{ required: 'JournalpostId er påkrevd' }}
            render={({ field, fieldState }) => (
                <div className={styles.blokk}>
                    <TextField
                        label="JournalpostId"
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value)}
                        error={fieldState.error?.message}
                    />
                    {valideringsInfo && (!fieldState.error || fnrMatcherIkke) && (
                        <div className={styles.valideringsInfo}>{valideringsInfo}</div>
                    )}
                </div>
            )}
        />
    );
};

export default JournalpostId;
