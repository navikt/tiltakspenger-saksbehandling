import { BodyShort, Button, Dialog, LocalAlert, VStack } from '@navikt/ds-react';
import { FetcherError } from '~/utils/fetch/fetch';
import { Nullable } from '~/types/UtilTypes';

import styles from './OvertaKlagebehandlingModal.module.css';

const OvertaKlagebehandlingModal = (props: {
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
        <Dialog open={props.åpen} onOpenChange={(nesteÅpen) => !nesteÅpen && props.onClose()}>
            <Dialog.Popup width={'480px'} className={styles.dialog}>
                <Dialog.Header>
                    <Dialog.Title>Overta behandling</Dialog.Title>
                </Dialog.Header>

                <Dialog.Body>
                    <VStack gap="space-16">
                        <BodyShort>
                            Er du sikker på at du vil ta over behandlingen fra {props.overtarFra}?
                        </BodyShort>

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
                    </VStack>
                </Dialog.Body>

                <Dialog.Footer>
                    <Button
                        type="button"
                        onClick={() => props.api.trigger({ overtarFra: props.overtarFra })}
                        loading={props.api.isMutating}
                    >
                        Overta behandling
                    </Button>

                    <Dialog.CloseTrigger>
                        <Button type="button" variant="secondary">
                            Avbryt
                        </Button>
                    </Dialog.CloseTrigger>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
};

export default OvertaKlagebehandlingModal;
