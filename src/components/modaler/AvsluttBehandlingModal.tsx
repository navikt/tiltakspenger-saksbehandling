import { TrashIcon } from '@navikt/aksel-icons';
import {
    Alert,
    BodyLong,
    Button,
    Heading,
    HStack,
    LocalAlert,
    Modal,
    Textarea,
} from '@navikt/ds-react';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import styles from './AvsluttBehandlingModal.module.css';
import { Nullable } from '~/types/UtilTypes';

type Props = {
    åpen: boolean;
    onClose: () => void;
    onSubmit: (begrunnelse: string) => void;
    tittel?: string;
    tekst?: string;
    textareaLabel?: string;
    footer?: {
        primaryButtonText?: string;
        secondaryButtonText?: string;
        isMutating: boolean;
        error: Nullable<string>;
    };
};

const AvsluttBehandlingModal = (props: Props) => {
    const form = useForm<{ begrunnelse: string }>({ defaultValues: { begrunnelse: '' } });

    return (
        <form
            onSubmit={form.handleSubmit((values) => {
                props.onSubmit(values.begrunnelse);
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
                        <TrashIcon title="Søppelbøtte ikon" fontSize="1.5rem" />
                        <Heading level="4" size="small">
                            {props.tittel ?? 'Avslutt behandling'}
                        </Heading>
                    </HStack>
                </Modal.Header>
                <Modal.Body className={styles.modalBody}>
                    <BodyLong className={styles.text}>
                        {props.tekst ??
                            'Hvis du avslutter behandlingen kan den ikke lenger behandles.'}
                    </BodyLong>
                    <Controller
                        rules={{ required: 'Du må fylle ut en begrunnelse' }}
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Textarea
                                {...field}
                                error={fieldState.error?.message}
                                className={styles.textarea}
                                label={
                                    props.textareaLabel ??
                                    'Hvorfor avsluttes behandlingen? (obligatorisk)'
                                }
                            />
                        )}
                        name={'begrunnelse'}
                    />
                    <Alert variant={'info'} size="small">
                        Bruker får ikke innsyn eller informasjon når behandlingen avsluttes i
                        tiltakspenger-saksbehandling. Du må vurdere å informere bruker i Modia om
                        hvorfor behandlingen er avsluttet, og hva det vil bety for bruker.
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    {props.footer?.error && (
                        <LocalAlert status="error" size="small">
                            <LocalAlert.Header>
                                <LocalAlert.Title>
                                    Feil ved avbrytelse av behandling
                                </LocalAlert.Title>
                            </LocalAlert.Header>
                            <LocalAlert.Content>{props.footer.error}</LocalAlert.Content>
                        </LocalAlert>
                    )}
                    <HStack gap="4">
                        <Button
                            variant="secondary"
                            type="button"
                            size="small"
                            onClick={props.onClose}
                        >
                            {props.footer?.secondaryButtonText ?? 'Ikke avslutt behandling'}
                        </Button>
                        <Button
                            variant="danger"
                            size="small"
                            loading={props.footer?.isMutating}
                            type="submit"
                        >
                            {props.footer?.primaryButtonText ?? 'Avslutt behandling'}
                        </Button>
                    </HStack>
                </Modal.Footer>
            </Modal>
        </form>
    );
};

export default AvsluttBehandlingModal;
