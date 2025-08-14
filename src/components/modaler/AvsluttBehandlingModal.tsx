import { TrashIcon } from '@navikt/aksel-icons';
import { Alert, BodyLong, Button, Heading, HStack, Modal, Textarea } from '@navikt/ds-react';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSak } from '~/context/sak/SakContext';
import { useAvsluttBehandling } from '~/components/behandlingmeny/useAvsluttBehandling';
import { SøknadIdEllerBehandlingId } from '~/components/saksoversikt/avsluttBehandling/AvsluttBehandlingProps';

import styles from './AvsluttBehandlingModal.module.css';

type Props = {
    saksnummer: string;
    åpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    tittel?: string;
    tekst?: string;
    textareaLabel?: string;
    footer?: {
        primaryButtonText?: string;
        secondaryButtonText?: string;
    };
} & SøknadIdEllerBehandlingId;

const AvsluttBehandlingModal = (props: Props) => {
    const { setSak } = useSak();
    const form = useForm<{ begrunnelse: string }>({ defaultValues: { begrunnelse: '' } });
    const { avsluttBehandling, avsluttBehandlingIsMutating } = useAvsluttBehandling(
        props.saksnummer,
    );

    const { søknadId, behandlingId } = props;

    return (
        <form
            onSubmit={form.handleSubmit((values) => {
                avsluttBehandling({
                    ...(søknadId ? { søknadId } : { behandlingId }),
                    begrunnelse: values.begrunnelse,
                }).then((sak) => {
                    props.onSuccess?.();
                    setSak(sak!);
                    props.onClose();
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
                    <Alert variant={'info'}>
                        Bruker får ikke innsyn eller informasjon når behandlingen avsluttes i
                        tiltakspenger-saksbehandling. Du må vurdere å informere bruker i Modia om
                        hvorfor behandlingen er avsluttet, og hva det vil bety for bruker.
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="danger"
                        size="small"
                        loading={avsluttBehandlingIsMutating}
                        type="submit"
                    >
                        {props.footer?.primaryButtonText ?? 'Avslutt behandling'}
                    </Button>
                    <Button variant="secondary" type="button" size="small" onClick={props.onClose}>
                        {props.footer?.secondaryButtonText ?? 'Ikke avslutt behandling'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </form>
    );
};

export default AvsluttBehandlingModal;
