import { Alert, BodyShort, Button, Heading, HStack, Modal, VStack } from '@navikt/ds-react';
import { BehandlingData, BehandlingId } from '~/types/BehandlingTypes';
import { SakId } from '~/types/SakTypes';
import { useFetchJsonFraApi } from '~/utils/fetch/useFetchFraApi';
import router from 'next/router';
import styles from './OvertaBehandlingModal.module.css';

const OvertabehandlingModal = (props: {
    sakId: SakId;
    behandlingId: BehandlingId;
    overtarFra: string;
    åpen: boolean;
    onClose: () => void;
}) => {
    const overtaBehandlingApi = useFetchJsonFraApi<BehandlingData, { overtarFra: string }>(
        `/sak/${props.sakId}/behandling/${props.behandlingId}/overta`,
        'PATCH',
        {
            onSuccess: (behandling) => {
                router.push(`/behandling/${behandling!.id}`);
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
                <VStack gap="4">
                    {overtaBehandlingApi.error && (
                        <Alert variant={'error'}>{overtaBehandlingApi.error.message}</Alert>
                    )}
                    <HStack gap="2">
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
