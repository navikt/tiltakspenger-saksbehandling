import { PauseIcon } from '@navikt/aksel-icons';
import { Button, Dialog, HStack, LocalAlert, Textarea } from '@navikt/ds-react';
import { Controller, useForm } from 'react-hook-form';
import { useRef } from 'react';
import { Nullable } from '~/types/UtilTypes';
import { FetcherError } from '~/utils/fetch/fetch';
import { Datovelger } from '~/lib/_felles/datovelger/Datovelger';
import { dateTilISOTekst } from '~/utils/date';
import { datovalideringsfeil } from '~/lib/_felles/datovelger/datovelgerUtils';

import styles from './SettKlagebehandlingPåVentModal.module.css';

const SettKlagebehandlingPåVentModal = (props: {
    åpen: boolean;
    onClose: () => void;
    oppdaterSattPåVent: boolean;
    api: {
        trigger: (begrunnelse: string, frist: Nullable<string>) => void;
        isMutating: boolean;
        error: Nullable<FetcherError>;
    };
}) => {
    const fristValideringsfeil = useRef<string | undefined>(undefined);
    const form = useForm<{ begrunnelse: string; frist: Nullable<string> }>({
        defaultValues: { begrunnelse: '', frist: '' },
    });
    const { isSubmitted } = form.formState;

    return (
        <Dialog
            open={props.åpen}
            onOpenChange={(nesteÅpen) => !nesteÅpen && props.onClose()}
            onOpenChangeComplete={(erÅpen) => {
                if (!erÅpen) {
                    fristValideringsfeil.current = undefined;
                    form.reset();
                }
            }}
        >
            <Dialog.Popup
                width={'700px'}
                className={styles.dialog}
                aria-label={
                    props.oppdaterSattPåVent ? 'Endre ventestatus' : 'Sett behandling på vent'
                }
            >
                <form
                    onSubmit={form.handleSubmit((values) => {
                        props.api.trigger(values.begrunnelse, values.frist);
                    })}
                >
                    <Dialog.Header>
                        <HStack gap="space-8" align="center">
                            <PauseIcon title="Pause ikon" fontSize="1.5rem" />
                            <Dialog.Title>
                                {props.oppdaterSattPåVent
                                    ? 'Endre ventestatus'
                                    : 'Sett behandling på vent'}
                            </Dialog.Title>
                        </HStack>
                    </Dialog.Header>

                    <Dialog.Body className={styles.dialogBody}>
                        <Controller
                            rules={{ required: 'Du må fylle ut en begrunnelse' }}
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Textarea
                                    {...field}
                                    error={fieldState.error?.message}
                                    className={styles.felt}
                                    label={'Hvorfor settes behandlingen på vent? (obligatorisk)'}
                                />
                            )}
                            name={'begrunnelse'}
                        />
                        <Controller
                            control={form.control}
                            rules={{ validate: () => fristValideringsfeil.current ?? true }}
                            render={({ field, fieldState }) => (
                                <Datovelger
                                    name={field.name}
                                    description={
                                        props.oppdaterSattPåVent
                                            ? 'Har behandlingen en frist fra før, blir den fjernet hvis du ikke velger ny.'
                                            : undefined
                                    }
                                    ref={field.ref}
                                    selected={field.value || undefined}
                                    error={fieldState.error?.message}
                                    className={styles.felt}
                                    onDateChange={(dato) =>
                                        form.setValue('frist', dato ? dateTilISOTekst(dato) : '', {
                                            shouldDirty: true,
                                        })
                                    }
                                    onValidate={(validering) => {
                                        fristValideringsfeil.current = datovalideringsfeil(
                                            validering,
                                            'Fristen kan ikke være før dagens dato',
                                        );
                                        if (isSubmitted) {
                                            void form.trigger('frist');
                                        }
                                    }}
                                    minDate={new Date()}
                                    label={'Når burde behandlingen gjenopptas? (valgfritt)'}
                                />
                            )}
                            name={'frist'}
                        />

                        {props.api.error && (
                            <LocalAlert status="error" size="small">
                                <LocalAlert.Header>
                                    <LocalAlert.Title>
                                        {props.oppdaterSattPåVent
                                            ? 'Kunne ikke endre ventestatus'
                                            : 'Kunne ikke sette behandling på vent'}
                                    </LocalAlert.Title>
                                </LocalAlert.Header>
                                <LocalAlert.Content>{props.api.error.message}</LocalAlert.Content>
                            </LocalAlert>
                        )}
                    </Dialog.Body>

                    <Dialog.Footer>
                        <Button variant="primary" loading={props.api.isMutating} type="submit">
                            {props.oppdaterSattPåVent
                                ? 'Endre ventestatus'
                                : 'Sett behandling på vent'}
                        </Button>

                        <Dialog.CloseTrigger>
                            <Button variant="secondary" type="button">
                                Avbryt
                            </Button>
                        </Dialog.CloseTrigger>
                    </Dialog.Footer>
                </form>
            </Dialog.Popup>
        </Dialog>
    );
};

export default SettKlagebehandlingPåVentModal;
