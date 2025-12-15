import { Alert, Loader, TextField } from '@navikt/ds-react';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { ManueltRegistrertSøknad } from '~/components/manuell-søknad/ManueltRegistrertSøknad';
import { useValiderJournalpostId } from './useValiderJournalpostId';
import { useDebounce } from 'use-debounce';
import styles from './JournalpostId.module.css';
import { formaterDatotekst } from '~/utils/date';

const DEBOUNCE_MS = 500;
const MIN_LENGDE_FØR_VALIDERING = 3;

export const JournalpostId = () => {
    const { control, watch, setError, clearErrors } = useFormContext<ManueltRegistrertSøknad>();
    const journalpostIdFelt = 'journalpostId';
    const journalpostIdWatch = watch(journalpostIdFelt);
    const fnrWatch = watch('personopplysninger.ident');
    const [debouncedJournalpostId] = useDebounce(journalpostIdWatch, DEBOUNCE_MS);
    const [datoOpprettet, setDatoOpprettet] = React.useState<string>('');

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
            setDatoOpprettet('');
            return;
        }
        if (isLoading) return;
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
            clearErrors('journalpostId');
            setDatoOpprettet(data.datoOpprettet ?? '');
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
                        Avsenderen av journalposten er en annen person enn søker, sjekk om
                        journalposten tilhører søker eller om det er verge/fullmakt.
                    </Alert>
                );
            }
            return (
                <Alert variant="success" inline aria-live="polite">
                    Journalpost finnes og søker står som avsender.
                </Alert>
            );
        }
        return null;
    }, [journalpostIdWatch, fnrWatch, isLoading, data]);

    const fnrMatcherIkke = !!data && data.journalpostFinnes && data.gjelderInnsendtFnr === false;

    return (
        <>
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
            <div className={styles.blokk}>
                <TextField
                    label="Opprettet (fra journalpost)"
                    value={formaterDatotekst(datoOpprettet)}
                    readOnly
                />
            </div>
        </>
    );
};

export default JournalpostId;
