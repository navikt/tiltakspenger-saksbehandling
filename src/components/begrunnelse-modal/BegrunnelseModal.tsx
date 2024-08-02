import { Button, Modal, Select } from '@navikt/ds-react';
import { RefObject, useContext, useState } from 'react';
import styles from './BegrunnelseModal.module.css';
import { BehandlingContext } from '../layout/SaksbehandlingLayout';
import { useSendTilbakeBehandling } from '../../hooks/useSendTilbakeBehandling';

interface BegrunnelseModalProps {
  modalRef: RefObject<HTMLDialogElement>;
}

const begrunnelseAlternativer = [
  'Vedtaksperioden som er foreslått er feil',
  'Antall dager per uke er feil',
  'Feil i vilkåret om forholdet til andre ytelser',
  'Feil i vilkåret om tiltaksdeltagelse',
  'Se/endre vilkår om barnetillegg',
  'Returneres etter ønske av saksbehandler',
];

const BegrunnelseModal = ({ modalRef }: BegrunnelseModalProps) => {
  const { behandlingId } = useContext(BehandlingContext);
  const [begrunnelse, setBegrunnelse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { sendTilbakeBehandling, senderTilbake, sendTilbakeBehandlingError } =
    useSendTilbakeBehandling(behandlingId);

  const lukkModal = () => {
    modalRef.current?.close();
  };

  const håndterSendTilbakeMedBegrunnelse = () => {
    if (begrunnelse == '') {
      setError('Du må velge en begrunnelse');
      return;
    }
    if (sendTilbakeBehandlingError) {
      setError(
        `Kunne ikke sende tilbake behandlingen (${sendTilbakeBehandlingError.status} ${sendTilbakeBehandlingError.info})`,
      );
    }
    sendTilbakeBehandling();
  };

  return (
    <Modal
      ref={modalRef}
      width="medium"
      className={styles.modal}
      aria-label="Legg til begrunnelse"
      onClose={() => {
        setError('');
        setBegrunnelse('');
      }}
    >
      <Modal.Body>
        <Select
          label="Velg begrunnelse for retur av vedtaksforslag"
          onChange={(e) => {
            setBegrunnelse(e.target.value);
          }}
          value={begrunnelse}
          error={error}
        >
          {
            <option key="ubesvart" value={''}>
              {'Velg begrunnelse'}
            </option>
          }
          {begrunnelseAlternativer.map((alternativ, index) => (
            <option key={`alternativ-${index}`} value={alternativ}>
              {alternativ}
            </option>
          ))}
        </Select>
      </Modal.Body>
      <Modal.Footer>
        <div className={styles.footer}>
          <Button
            loading={senderTilbake}
            onClick={() => håndterSendTilbakeMedBegrunnelse()}
            className={styles.knapp}
          >
            Ja, send i retur
          </Button>
          <Button
            className={styles.knapp}
            type="button"
            variant="secondary"
            onClick={() => lukkModal()}
          >
            Nei, avbryt
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default BegrunnelseModal;
