import { Button, HStack } from '@navikt/ds-react';
import Varsel from '../../varsel/Varsel';
import { MeldekortDag, Meldekortstatus } from '../../../types/MeldekortTypes';
import { useSendMeldekortTilBeslutter } from '../../../hooks/meldekort/useSendMeldekortTilBeslutter';
import { useHentMeldekort } from '../../../hooks/meldekort/useHentMeldekort';
import { useGodkjennMeldekort } from '../../../hooks/meldekort/useGodkjennMeldekort';
import BekreftelseseModal from '../../bekreftelsesmodal/BekreftelsesModal';
import { useRef } from 'react';

interface MeldekortKnapperProps {
  meldekortdager: MeldekortDag[];
  meldekortId: string;
  sakId: string;
}

export const MeldekortKnapper = ({
  meldekortdager,
  meldekortId,
  sakId,
}: MeldekortKnapperProps) => {
  const { sendMeldekortTilBeslutter, senderMeldekortTilBeslutter, error } =
    useSendMeldekortTilBeslutter(meldekortId, sakId);
  const { meldekort } = useHentMeldekort(meldekortId, sakId);
  const {
    onGodkjennMeldekort,
    isMeldekortMutating,
    feilVedGodkjenning,
    reset,
  } = useGodkjennMeldekort(meldekortId, sakId);
  const modalRef = useRef(null);

  const lukkModal = () => {
    modalRef.current.close();
    reset();
  };

  return (
    <HStack gap="3">
      {error && (
        <Varsel
          variant="error"
          melding={`Kunne ikke sende meldekortet til beslutter (${error.status} ${error.info})`}
        />
      )}
      {meldekort.status == Meldekortstatus.KLAR_TIL_UTFYLLING ? (
        <Button
          size="small"
          loading={senderMeldekortTilBeslutter}
          onClick={() => {
            sendMeldekortTilBeslutter({
              dager: meldekortdager.map((dag) => ({
                dato: dag.dato,
                status: dag.status,
              })),
            });
          }}
        >
          Send til beslutter
        </Button>
      ) : meldekort.status == Meldekortstatus.KLAR_TIL_BESLUTNING ? (
        <Button
          size="small"
          loading={isMeldekortMutating}
          onClick={() => modalRef.current?.showModal()}
        >
          Godkjenn meldekort
        </Button>
      ) : (
        <></>
      )}
      <BekreftelseseModal
        modalRef={modalRef}
        tittel={'Godkjenn meldekortet'}
        body={
          'Er du sikker på at meldekortet er korrekt og ønsker å sende det til utbetaling?'
        }
        error={feilVedGodkjenning}
        lukkModal={lukkModal}
      >
        <Button
          variant="primary"
          loading={isMeldekortMutating}
          onClick={() => {
            onGodkjennMeldekort();
          }}
        >
          Godkjenn meldekort
        </Button>
      </BekreftelseseModal>
    </HStack>
  );
};
