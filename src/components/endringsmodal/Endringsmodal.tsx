import { Button, Modal } from '@navikt/ds-react';
import { ReactNode, RefObject } from 'react';

interface EndringsmodalProps {
  modalRef: RefObject<HTMLDialogElement>;
  children?: ReactNode;
  håndterLagring: () => void;
  tittel: string;
}

const Endringsmodal = ({
  modalRef,
  children,
  håndterLagring,
  tittel,
}: EndringsmodalProps) => {
  return (
    <Modal
      ref={modalRef}
      width="medium"
      aria-label={tittel}
      onClose={() => modalRef.current.close()}
      header={{ heading: tittel }}
    >
      <form method="dialog" id="skjema">
        <Modal.Body style={{ paddingTop: 0 }}>{children}</Modal.Body>
      </form>
      <Modal.Footer>
        <Button onClick={() => håndterLagring()}>Lagre</Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => modalRef.current.close()}
        >
          Avbryt
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Endringsmodal;
