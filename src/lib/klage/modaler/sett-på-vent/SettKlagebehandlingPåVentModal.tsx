import { PauseIcon } from '@navikt/aksel-icons';
import { Button, Dialog, HStack, LocalAlert, Textarea } from '@navikt/ds-react';
import { Controller, useForm } from 'react-hook-form';
import { Nullable } from '~/types/UtilTypes';
import { FetcherError } from '~/utils/fetch/fetch';
import { Datovelger } from '~/lib/_felles/datovelger/Datovelger';
import { dateTilISOTekst, datoTilDatoInputText } from '~/utils/date';

import styles from './SettKlagebehandlingPåVentModal.module.css';

const SettKlagebehandlingPåVentModal = (props: {
    åpen: boolean;
    onClose: () => void;
    api: {
        trigger: (begrunnelse: string, frist: Nullable<string>) => void;
        isMutating: boolean;
        error: Nullable<FetcherError>;
    };
}) => {
    const form = useForm<{ begrunnelse: string; frist: Nullable<string> }>({
        defaultValues: { begrunnelse: '', frist: '' },
    });

    return (
        <Dialog open={props.åpen} onOpenChange={(nesteÅpen) => !nesteÅpen && props.onClose()}>
            <Dialog.Popup
                width={'700px'}
                className={styles.dialog}
                aria-label="Sett behandling på vent"
            >
                <form
                    onSubmit={form.handleSubmit((values) => {
                        props.api.trigger(values.begrunnelse, values.frist);
                    })}
                >
                    <Dialog.Header>
                        <HStack gap="space-8" align="center">
                            <PauseIcon title="Pause ikon" fontSize="1.5rem" />
                            <Dialog.Title>{'Sett behandling på vent'}</Dialog.Title>
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
                            render={({ field, fieldState }) => (
                                <Datovelger
                                    {...field}
                                    error={fieldState.error?.message}
                                    className={styles.felt}
                                    onDateChange={(dato) =>
                                        field.onChange(dato ? dateTilISOTekst(dato) : '')
                                    }
                                    minDate={new Date()}
                                    value={field.value ? datoTilDatoInputText(field.value) : ''}
                                    label={'Når burde behandlingen gjenopptas? (valgfritt)'}
                                />
                            )}
                            name={'frist'}
                        />

                        {props.api.error && (
                            <LocalAlert status="error" size="small">
                                <LocalAlert.Header>
                                    <LocalAlert.Title>
                                        Kunne ikke sette behandling på vent
                                    </LocalAlert.Title>
                                </LocalAlert.Header>
                                <LocalAlert.Content>{props.api.error.message}</LocalAlert.Content>
                            </LocalAlert>
                        )}
                    </Dialog.Body>

                    <Dialog.Footer>
                        <Button variant="primary" loading={props.api.isMutating} type="submit">
                            Sett behandling på vent
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
