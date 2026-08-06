import { BodyLong, Button, Dialog } from '@navikt/ds-react';
import { Nullable } from '~/types/UtilTypes';
import { FetcherError } from '~/utils/fetch/fetch';

export type ApiErrorState = {
    visFeilModal: boolean;
    feil: Nullable<FetcherError>;
};

export const KlageApiErrorFeilModal = (props: {
    åpen: boolean;
    onClose: () => void;
    error: FetcherError;
}) => {
    return (
        <Dialog open={props.åpen} onOpenChange={(nesteÅpen) => !nesteÅpen && props.onClose()}>
            <Dialog.Popup width={'small'}>
                <Dialog.Header>
                    <Dialog.Title>{'Handlingen kunne ikke utføres'}</Dialog.Title>
                </Dialog.Header>

                <Dialog.Body>
                    <BodyLong>{props.error.message}</BodyLong>
                </Dialog.Body>

                <Dialog.Footer>
                    <Dialog.CloseTrigger>
                        <Button variant="secondary" size="small">
                            Lukk
                        </Button>
                    </Dialog.CloseTrigger>
                </Dialog.Footer>
            </Dialog.Popup>
        </Dialog>
    );
};
