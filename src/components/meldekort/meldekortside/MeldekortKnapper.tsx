import { PencilWritingIcon } from '@navikt/aksel-icons';
import { Button, HStack } from '@navikt/ds-react';
import { useContext } from 'react';
import { useGodkjennMeldekort } from '../../../hooks/meldekort/useGodkjennMeldekort';
import { SaksbehandlerContext } from '../../../pages/_app';
import Varsel from '../../varsel/Varsel';

interface MeldekortKnapperProps {
  håndterEndreMeldekort: () => void;
  meldekortId: string;
}

export const MeldekortKnapper = ({
  håndterEndreMeldekort,
  meldekortId,
}: MeldekortKnapperProps) => {
  const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);
  const { onGodkjennMeldekort, isMeldekortMutating, error } =
    useGodkjennMeldekort(meldekortId);

  return (
    <HStack gap="3">
      {error && (
        <Varsel
          variant="error"
          melding={`Kunne ikke godkjenne meldekortet (${error.status} ${error.info})`}
        />
      )}
      <Button
        icon={<PencilWritingIcon />}
        variant="tertiary"
        size="small"
        onClick={() => håndterEndreMeldekort()}
      >
        Endre meldekortperiode
      </Button>
      <Button
        size="small"
        loading={isMeldekortMutating}
        onClick={() =>
          onGodkjennMeldekort({
            saksbehandler: innloggetSaksbehandler.navIdent,
          })
        }
      >
        Godkjenn meldekortperiode
      </Button>
    </HStack>
  );
};
