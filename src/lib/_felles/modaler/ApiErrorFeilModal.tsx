import { Button, LocalAlert, Modal } from '@navikt/ds-react';
import { Nullable } from '~/types/UtilTypes';
import { FetcherError } from '~/utils/fetch/fetch';

export type ApiErrorState = {
    visFeilModal: boolean;
    feil: Nullable<FetcherError>;
};

export const ApiErrorFeilModal = (props: {
    åpen: boolean;
    onClose: () => void;
    error: FetcherError;
}) => {
    return (
        <Modal aria-label="Feil ved handling" open={props.åpen} onClose={props.onClose}>
            <Modal.Body>
                {props.error && (
                    <LocalAlert status="error">
                        <LocalAlert.Header>
                            <LocalAlert.Title>En feil skjedde</LocalAlert.Title>
                        </LocalAlert.Header>
                        <LocalAlert.Content>{props.error.message}</LocalAlert.Content>
                    </LocalAlert>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onClose} size="small">
                    Lukk
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
