import { BodyLong, Button, Modal } from '@navikt/ds-react';
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
        <Modal
            header={{ heading: 'Handlingen kunne ikke utføres' }}
            open={props.åpen}
            onClose={props.onClose}
            width="small"
        >
            <Modal.Body>
                <BodyLong>{props.error.message}</BodyLong>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onClose} size="small">
                    Lukk
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
