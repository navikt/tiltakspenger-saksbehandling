import { Button, Modal } from '@navikt/ds-react';
import { ReactNode, RefObject } from 'react';

type Props = {
    modalRef: RefObject<HTMLDialogElement>;
    heading: string;
    children?: ReactNode;
    submitTekst: string;
    onSubmit: () => void;
};

const Spørsmålsmodal = ({ modalRef, heading, submitTekst, onSubmit, children }: Props) => {
    const lukkModal = () => modalRef.current?.close();

    return (
        <Modal
            ref={modalRef}
            width="medium"
            aria-label={heading}
            onClose={lukkModal}
            header={{ heading: heading }}
        >
            <form method="dialog" id="skjema">
                <Modal.Body style={{ paddingTop: 0 }}>{children}</Modal.Body>
            </form>
            <Modal.Footer>
                <Button type="submit" form="skjema" variant="primary" onClick={() => onSubmit()}>
                    {submitTekst}
                </Button>
                <Button type="button" variant="secondary" onClick={lukkModal}>
                    Avbryt
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default Spørsmålsmodal;
