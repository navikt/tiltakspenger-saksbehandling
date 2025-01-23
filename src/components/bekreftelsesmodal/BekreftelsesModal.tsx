import { BodyShort, Button, Modal } from '@navikt/ds-react';
import { ReactNode, RefObject } from 'react';
import { FetcherError } from '../../utils/http';
import Varsel from '../varsel/Varsel';

interface BekreftelsesModalProps {
    modalRef: RefObject<HTMLDialogElement>;
    children?: ReactNode;
    tittel: string;
    body: string;
    error?: FetcherError;
    lukkModal: () => void;
}

const BekreftelsesModal = ({
    modalRef,
    children,
    tittel,
    body,
    error,
    lukkModal,
}: BekreftelsesModalProps) => {
    return (
        <Modal
            ref={modalRef}
            width="medium"
            aria-label="Bekreft handling"
            onClose={() => {
                lukkModal();
            }}
            header={{ heading: tittel }}
        >
            <Modal.Body>
                <BodyShort>{body}</BodyShort>
            </Modal.Body>
            <Modal.Footer>
                <Button type="button" variant="secondary" onClick={() => lukkModal()}>
                    Nei, avbryt
                </Button>
                {children}
                {error && <Varsel variant="error" melding={error.message} />}
            </Modal.Footer>
        </Modal>
    );
};

export default BekreftelsesModal;
