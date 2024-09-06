import { PencilWritingIcon } from '@navikt/aksel-icons';
import { Button, HStack } from '@navikt/ds-react';
import Varsel from '../../varsel/Varsel';
import { MeldekortDag } from '../../../types/MeldekortTypes';
import { useSendMeldekortTilBeslutter } from '../../../hooks/meldekort/useSendMeldekortTilBeslutter';

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

  return (
    <HStack gap="3">
      {error && (
        <Varsel
          variant="error"
          melding={`Kunne ikke sende meldekortet til beslutter (${error.status} ${error.info})`}
        />
      )}
      <Button
        size="small"
        loading={senderMeldekortTilBeslutter}
        onClick={() => {
          sendMeldekortTilBeslutter({ dager: meldekortdager });
        }}
      >
        Send til beslutter
      </Button>
    </HStack>
  );
};
