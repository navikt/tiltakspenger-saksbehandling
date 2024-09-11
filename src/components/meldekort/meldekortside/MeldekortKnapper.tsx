import { Button, HStack } from '@navikt/ds-react';
import Varsel from '../../varsel/Varsel';
import { MeldekortDag, Meldekortstatus } from '../../../types/MeldekortTypes';
import { useSendMeldekortTilBeslutter } from '../../../hooks/meldekort/useSendMeldekortTilBeslutter';
import { useHentMeldekort } from '../../../hooks/meldekort/useHentMeldekort';
import { useGodkjennMeldekort } from '../../../hooks/meldekort/useGodkjennMeldekort';

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
  const { onGodkjennMeldekort, isMeldekortMutating } = useGodkjennMeldekort(
    meldekortId,
    sakId,
  );
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
          onClick={() => onGodkjennMeldekort()}
        >
          Godkjenn meldekort
        </Button>
      ) : (
        <></>
      )}
    </HStack>
  );
};
