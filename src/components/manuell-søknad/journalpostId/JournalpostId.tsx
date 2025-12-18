import { Alert, Loader, TextField } from '@navikt/ds-react';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { ManueltRegistrertSøknad } from '~/components/manuell-søknad/ManueltRegistrertSøknad';
import { useValiderJournalpostId } from './useValiderJournalpostId';
import { useDebounce } from 'use-debounce';
import styles from './JournalpostId.module.css';
import { formaterDatotekst } from '~/utils/date';

const DEBOUNCE_MS = 500;
const MIN_LENGDE_FØR_VALIDERING = 5;

export const JournalpostId = () => {
    const { control, watch, setError, clearErrors } = useFormContext<ManueltRegistrertSøknad>();
    const journalpostIdFelt = 'journalpostId';
    const journalpostIdWatch = watch(journalpostIdFelt);
    const fnrWatch = watch('personopplysninger.ident');
    const [debouncedJournalpostId] = useDebounce(journalpostIdWatch, DEBOUNCE_MS);
    const [datoOpprettet, setDatoOpprettet] = React.useState<string>('');

    const inneholderKunTall = (value: string) => /^[0-9]*$/.test(value);
    const journalpostId = (debouncedJournalpostId ?? '').trim();
    const shouldValidate =
        inneholderKunTall(journalpostId) && journalpostId.length >= MIN_LENGDE_FØR_VALIDERING;

    const { data, isLoading, error } = useValiderJournalpostId({
        fnr: fnrWatch ?? '',
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
        if (!value || !fnrWatch || !shouldValidate) return null;

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
                    <Alert variant="success" inline aria-live="polite">
                        Journalpost finnes og søker står som avsender.
                    </Alert>
                );
            }

            if (data.gjelderInnsendtFnr === false) {
                return (
                    <Alert variant="warning" inline aria-live="polite">
                        Avsenderen av journalposten er en annen person enn søker, sjekk om
                        journalposten tilhører søker eller om det er verge/fullmakt.
                    </Alert>
                );
            }
        }
        return null;
    }, [journalpostIdWatch, fnrWatch, shouldValidate, isLoading, data]);

    const fnrMatcherIkke = !!data && data.journalpostFinnes && data.gjelderInnsendtFnr === false;

    return (
        <>
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
