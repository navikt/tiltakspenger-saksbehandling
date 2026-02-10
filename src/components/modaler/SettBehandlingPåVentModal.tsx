import { PauseIcon } from '@navikt/aksel-icons';
import { Button, Heading, HStack, LocalAlert, Modal, Textarea } from '@navikt/ds-react';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import styles from './AvsluttBehandlingModal.module.css';

import { Nullable } from '~/types/UtilTypes';
import { FetcherError } from '~/utils/fetch/fetch';
import { Datovelger } from '~/components/datovelger/Datovelger';
import { dateTilISOTekst, datoTilDatoInputText } from '~/utils/date';

const SettBehandlingPåVentModal = (props: {
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
        <form
            onSubmit={form.handleSubmit((values) => {
                props.api.trigger(values.begrunnelse, values.frist);
            })}
        >
            <Modal
                className={styles.modal}
                width={700}
                aria-label="Avslutt behandling"
                open={props.åpen}
                onClose={props.onClose}
                size="small"
            >
                <Modal.Header className={styles.modalHeader}>
                    <HStack>
                        <PauseIcon title="Pause ikon" fontSize="1.5rem" />
                        <Heading level="4" size="small">
                            {'Sett behandling på vent'}
                        </Heading>
                    </HStack>
                </Modal.Header>
                <Modal.Body className={styles.modalBody}>
                    <Controller
                        rules={{ required: 'Du må fylle ut en begrunnelse' }}
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Textarea
                                {...field}
                                error={fieldState.error?.message}
                                className={styles.textarea}
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
                                className={styles.textarea}
                                onDateChange={(dato) =>
                                    field.onChange(dato ? dateTilISOTekst(dato) : '')
                                }
                                value={field.value ? datoTilDatoInputText(field.value) : ''}
                            />
                        )}
                        name={'frist'}
                    />
                </Modal.Body>
                <Modal.Footer>
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
                    <HStack gap="space-16">
                        <Button variant="secondary" type="button" onClick={props.onClose}>
                            Avbryt
                        </Button>
                        <Button variant="primary" loading={props.api.isMutating} type="submit">
                            Sett behandling på vent
                        </Button>
                    </HStack>
                </Modal.Footer>
            </Modal>
        </form>
    );
};

export default SettBehandlingPåVentModal;
