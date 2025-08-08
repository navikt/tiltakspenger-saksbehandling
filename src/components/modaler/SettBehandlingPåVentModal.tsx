import { PauseIcon } from '@navikt/aksel-icons';
import { Button, Heading, HStack, Modal, Textarea } from '@navikt/ds-react';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import styles from './AvsluttBehandlingModal.module.css';
import { BehandlingId } from '~/types/BehandlingTypes';
import { useSettBehandlingPåVent } from '~/components/behandlingmeny/useSettBehandlingPåVent';
import { SakId } from '~/types/SakTypes';
import router from 'next/router';

const SettBehandlingPåVentModal = (props: {
    sakId: SakId;
    behandlingId: BehandlingId;
    saksnummer: string;
    åpen: boolean;
    onClose: () => void;
}) => {
    const form = useForm<{ begrunnelse: string }>({ defaultValues: { begrunnelse: '' } });
    const { settBehandlingPåVent, isSettBehandlingPåVentMutating } = useSettBehandlingPåVent(
        props.sakId,
        props.behandlingId,
    );

    return (
        <form
            onSubmit={form.handleSubmit((values) => {
                settBehandlingPåVent({
                    sakId: props.sakId,
                    behandlingId: props.behandlingId,
                    begrunnelse: values.begrunnelse,
                }).then(() => {
                    props.onClose();
                    router.push(`/sak/${props.saksnummer}`);
                });
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
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        loading={isSettBehandlingPåVentMutating}
                        type="submit"
                    >
                        Sett behandling på vent
                    </Button>
                    <Button variant="secondary" type="button" onClick={props.onClose}>
                        Avbryt
                    </Button>
                </Modal.Footer>
            </Modal>
        </form>
    );
};

export default SettBehandlingPåVentModal;
