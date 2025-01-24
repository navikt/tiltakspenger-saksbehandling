import { Button, Modal } from '@navikt/ds-react';
import { ReactNode, RefObject } from 'react';

interface EndringsmodalProps {
  modalRef: RefObject<HTMLDialogElement>;
  children?: ReactNode;
  håndterLagring: () => void;
  onClose?: () => void;
  tittel: string;
  ikon?: ReactNode;
}

const Endringsmodal = ({
  modalRef,
  children,
  håndterLagring,
  onClose,
  tittel,
  ikon,
}: EndringsmodalProps) => {
  const lukkModal = onClose ? () => onClose() : () => modalRef.current.close();
  return (
    <Modal
      ref={modalRef}
      width="medium"
      aria-label={tittel}
      onClose={() => lukkModal()}
      header={{ heading: tittel, icon: ikon }}
    >
      <form method="dialog" id="skjema">
        <Modal.Body style={{ paddingTop: 0 }}>{children}</Modal.Body>
      </form>
      <Modal.Footer>
        <Button onClick={() => håndterLagring()}>Lagre</Button>
        <Button type="button" variant="secondary" onClick={() => lukkModal()}>
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Endringsmodal;
