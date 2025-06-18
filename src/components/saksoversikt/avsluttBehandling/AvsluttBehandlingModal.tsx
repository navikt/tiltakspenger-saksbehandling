import { TrashIcon } from '@navikt/aksel-icons';
import { Alert, BodyLong, Button, Heading, HStack, Modal, Textarea } from '@navikt/ds-react';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import styles from './AvsluttBehandlingModal.module.css';
import { BehandlingId } from '~/types/BehandlingTypes';
import { SøknadId } from '~/types/SøknadTypes';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import { Nullable } from '~/types/common';
import { SakProps } from '~/types/SakTypes';
import { useSak } from '~/context/sak/SakContext';

const AvsluttBehandlingModal = (props: {
    saksnummer: string;
    søknadsId: Nullable<SøknadId>;
    behandlingsId: Nullable<BehandlingId>;
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
}) => {
    const { setSak } = useSak();
    const form = useForm<{ begrunnelse: string }>({ defaultValues: { begrunnelse: '' } });

    const avsluttBehandlingMutation = useFetchJsonFraApi<
        SakProps,
        { søknadId: Nullable<string>; behandlingId: Nullable<string>; begrunnelse: string }
    >(`sak/${props.saksnummer}/avbryt-aktiv-behandling`, 'POST', {
        onSuccess: (sak) => {
            props.onSuccess?.();
            setSak(sak!);
            props.onClose();
        },
    });

    return (
        <form
            onSubmit={form.handleSubmit((values) => {
                avsluttBehandlingMutation.trigger({
                    søknadId: props.søknadsId,
                    behandlingId: props.behandlingsId,
                    begrunnelse: values.begrunnelse,
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
                    <BodyLong>
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
                        loading={avsluttBehandlingMutation.isMutating}
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
