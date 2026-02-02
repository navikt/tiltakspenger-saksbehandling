import { BodyShort, Button, Heading, HStack, LocalAlert, Modal, VStack } from '@navikt/ds-react';

import styles from './OvertaBehandlingModal.module.css';
import { FetcherError } from '~/utils/fetch/fetch';
import { Nullable } from '~/types/UtilTypes';

const OvertabehandlingModal = (props: {
    overtarFra: string;
    åpen: boolean;
    onClose: () => void;
    api: {
        trigger: (data: { overtarFra: string }) => void;
        isMutating: boolean;
        error: Nullable<FetcherError>;
    };
}) => {
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
                    {props.api?.error && (
                        <LocalAlert status="error" size="small">
                            <LocalAlert.Header>
                                <LocalAlert.Title>
                                    Feil ved overtakelse av behandling
                                </LocalAlert.Title>
                            </LocalAlert.Header>
                            <LocalAlert.Content>{props.api.error.message}</LocalAlert.Content>
                        </LocalAlert>
                    )}
                    <HStack gap="space-8">
                        <Button type="button" variant="secondary" onClick={props.onClose}>
                            Avbryt
                        </Button>
                        <Button
                            type="button"
                            onClick={() => props.api.trigger({ overtarFra: props.overtarFra })}
                            loading={props.api.isMutating}
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
