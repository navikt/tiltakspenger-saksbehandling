import { Alert, BodyShort, Button, Heading, HStack, Modal, VStack } from '@navikt/ds-react';

import { SakId } from '~/types/Sak';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import router from 'next/router';
import { behandlingUrl } from '~/utils/urls';

import styles from './OvertaBehandlingModal.module.css';
import { Rammebehandling, BehandlingId } from '~/types/Rammebehandling';

const OvertabehandlingModal = (props: {
    sakId: SakId;
    behandlingId: BehandlingId;
    overtarFra: string;
    åpen: boolean;
    onClose: () => void;
}) => {
    const overtaBehandlingApi = useFetchJsonFraApi<Rammebehandling, { overtarFra: string }>(
        `/sak/${props.sakId}/behandling/${props.behandlingId}/overta`,
        'PATCH',
        {
            onSuccess: (behandling) => {
                if (behandling) {
                    router.push(behandlingUrl(behandling));
                }
            },
        },
    );

    return (
        <Modal
            width={480}
            aria-label="Overta behandling"
            open={props.åpen}
            onClose={props.onClose}
            className={styles.modal}
        >
            <Modal.Header>
                <Heading size="medium" level="3">
                    Overta behandling
                </Heading>
            </Modal.Header>
            <Modal.Body>
                <BodyShort>
                    Er du sikker på at du vil ta over behandlingen fra {props.overtarFra}?
                </BodyShort>
            </Modal.Body>
            <Modal.Footer>
                <VStack gap="space-16">
                    {overtaBehandlingApi.error && (
                        <Alert variant={'error'}>{overtaBehandlingApi.error.message}</Alert>
                    )}
                    <HStack gap="space-8">
                        <Button type="button" variant="secondary" onClick={props.onClose}>
                            Avbryt
                        </Button>
                        <Button
                            type="button"
                            onClick={() =>
                                overtaBehandlingApi.trigger({ overtarFra: props.overtarFra })
                            }
                            loading={overtaBehandlingApi.isMutating}
                        >
                            Overta behandling
                        </Button>
                    </HStack>
                </VStack>
            </Modal.Footer>
        </Modal>
    );
};

export default OvertabehandlingModal;
