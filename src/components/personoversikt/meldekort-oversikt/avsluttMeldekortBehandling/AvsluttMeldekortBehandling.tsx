import React, { FormEvent, useRef, useState } from 'react';
import router from 'next/router';
import {
    Alert,
    BodyLong,
    Button,
    ButtonProps,
    Heading,
    HStack,
    Modal,
    Textarea,
    VStack,
} from '@navikt/ds-react';
import { TrashIcon } from '@navikt/aksel-icons';
import { SakId } from '~/types/Sak';
import {
    MeldekortBehandlingId,
    MeldekortBehandlingProps,
} from '~/types/meldekort/MeldekortBehandling';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import styles from './AvsluttMeldekortBehandling.module.css';

export const AvsluttMeldekortbehandlingModal = (props: {
    sakId: SakId;
    meldekortBehandlingId: MeldekortBehandlingId;
    personoversiktUrl: string;
    åpen: boolean;
    onClose: () => void;
}) => {
    const begrunnelseRef = useRef<HTMLTextAreaElement>(null);
    const [error, setError] = useState<string>();
    const hasError = error !== undefined;

    const avsluttMeldekortBehandlingApi = useFetchJsonFraApi<
        MeldekortBehandlingProps,
        { begrunnelse: string }
    >(`/sak/${props.sakId}/meldekort/${props.meldekortBehandlingId}/avbryt`, 'POST', {
        onSuccess: () => {
            router.push(props.personoversiktUrl);
        },
    });

    const submit = (e: FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const begrunnelse = begrunnelseRef.current?.value?.trim();
        if (!begrunnelse || begrunnelse === '') {
            setError('Du må fylle ut en begrunnelse');
        } else {
            avsluttMeldekortBehandlingApi.trigger({
                begrunnelse: begrunnelse,
            });
        }
    };

    return (
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
                    <TrashIcon title="Søppelbøtteikon" fontSize="1.5rem" />
                    <Heading level="4" size="small">
                        Avslutt behandling
                    </Heading>
                </HStack>
            </Modal.Header>
            <Modal.Body className={styles.modalBody}>
                <BodyLong size={'small'}>
                    Hvis du avslutter meldekortbehandlingen må behandlingen startes på nytt for å
                    behandle meldekortet manuelt.
                </BodyLong>
                <BodyLong size={'small'}>
                    {
                        'Dersom det finnes ubehandlede korrigeringer fra bruker for denne perioden, vil '
                    }
                    {
                        'varselet for disse fjernes fra "åpne behandlinger"-oversikten når du avslutter behandlingen.'
                    }
                </BodyLong>
                <Textarea
                    ref={begrunnelseRef}
                    onChange={() => {
                        setError(undefined);
                    }}
                    error={error}
                    label={'Hvorfor avsluttes behandlingen? (obligatorisk)'}
                    maxLength={200}
                    id="begrunnelse"
                    size="small"
                    aria-label={'Begrunnelse'}
                    disabled={false}
                />
            </Modal.Body>
            <Modal.Footer>
                <VStack gap="space-16">
                    <HStack gap="space-8">
                        <Button
                            variant="secondary"
                            type="button"
                            size="small"
                            onClick={props.onClose}
                        >
                            Ikke avslutt behandling
                        </Button>
                        <Button
                            data-color="danger"
                            variant="primary"
                            size="small"
                            loading={avsluttMeldekortBehandlingApi.isMutating}
                            type="submit"
                            disabled={hasError}
                            onClick={(e) => {
                                submit(e);
                            }}
                        >
                            Avslutt behandling
                        </Button>
                    </HStack>
                    {avsluttMeldekortBehandlingApi.error && (
                        <Alert variant={'error'} size="small">
                            {avsluttMeldekortBehandlingApi.error.message}
                        </Alert>
                    )}
                </VStack>
            </Modal.Footer>
        </Modal>
    );
};

const AvsluttMeldekortBehandling = (props: {
    sakId: SakId;
    meldekortBehandlingId: MeldekortBehandlingId;
    personoversiktUrl: string;
    buttonProps?: {
        size?: ButtonProps['size'];
        variant?: ButtonProps['variant'];
    };
}) => {
    const [vilAvslutteBehandling, setVilAvslutteBehandling] = useState(false);

    return (
        <div>
            {vilAvslutteBehandling && (
                <AvsluttMeldekortbehandlingModal
                    åpen={vilAvslutteBehandling}
                    onClose={() => setVilAvslutteBehandling(false)}
                    sakId={props.sakId}
                    meldekortBehandlingId={props.meldekortBehandlingId}
                    personoversiktUrl={props.personoversiktUrl}
                />
            )}
            <Button
                className={styles.knapp}
                size={props.buttonProps?.size ?? 'small'}
                variant={props.buttonProps?.variant ?? 'danger'}
                type="button"
                onClick={() => {
                    setVilAvslutteBehandling(true);
                }}
            >
                Avslutt behandling
            </Button>
        </div>
    );
};

export default AvsluttMeldekortBehandling;
