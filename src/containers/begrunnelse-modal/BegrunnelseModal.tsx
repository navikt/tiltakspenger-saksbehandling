import { Button, Modal, Select } from '@navikt/ds-react';
import { RefObject, useState } from 'react';
import toast from 'react-hot-toast';
import { useSWRConfig } from 'swr';
import styles from './BegrunnelseModal.module.css';

interface BegrunnelseModalProps {
  behandlingid: string;
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

const BegrunnelseModal = ({
  behandlingid,
  modalRef,
}: BegrunnelseModalProps) => {
  const mutator = useSWRConfig().mutate;
  const [begrunnelse, setBegrunnelse] = useState<string>('');
  const [error, setError] = useState<string>('');

  const lukkModal = () => {
    modalRef.current?.close();
  };

  const håndterSendTilbakeMedBegrunnelse = () => {
    if (begrunnelse == '') {
      setError('Du må velge en begrunnelse');
      return;
    }
    const res = fetch(`/api/behandling/sendtilbake/${behandlingid}`, {
      method: 'POST',
      body: JSON.stringify({ begrunnelse: begrunnelse }),
    }).then(() => {
      mutator(`/api/behandling/${behandlingid}`).then(() => {
        toast('Behandling sendt tilbake til saksbehandler');
      });
      lukkModal();
    });
  };

  return (
    <Modal
      ref={modalRef}
      width="medium"
      className={styles.modal}
      onClose={() => {
        setError('');
        setBegrunnelse('');
      }}
    >
      <Modal.Body>
        <Select
          label="Velg begrunnelse for retur av vedtaksforslag"
          onChange={(e) => {
            if (e.target.value === '') {
              setError('Du må velge en begrunnelse');
            } else {
              setError('');
            }
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
