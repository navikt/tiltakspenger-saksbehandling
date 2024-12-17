import { Button, Modal } from '@navikt/ds-react';
import { ReactNode, RefObject } from 'react';

interface SpørsmålsmodalProps {
  modalRef: RefObject<HTMLDialogElement>;
  heading: string;
  children?: ReactNode;
  submitTekst: string;
  onSubmit: () => void;
}

const Spørsmålsmodal = ({
  modalRef,
  heading,
  submitTekst,
  onSubmit,
  children,
}: SpørsmålsmodalProps) => {
  return (
    <Modal
      ref={modalRef}
      width="medium"
      aria-label={heading}
      onClose={() => {
        modalRef.current.close();
      }}
      header={{ heading: heading }}
    >
      <form method="dialog" id="skjema">
        <Modal.Body style={{ paddingTop: 0 }}>{children}</Modal.Body>
      </form>
      <Modal.Footer>
        <Button
          type="submit"
          form="skjema"
          variant="primary"
          onClick={() => onSubmit()}
        >
          {submitTekst}
        </Button>
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

export default Spørsmålsmodal;
