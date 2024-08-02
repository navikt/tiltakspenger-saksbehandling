import { PencilWritingIcon } from '@navikt/aksel-icons';
import { Button, HStack } from '@navikt/ds-react';
import { useContext } from 'react';
import { useGodkjennMeldekort } from '../../../hooks/meldekort/useGodkjennMeldekort';
import { SaksbehandlerContext } from '../../../pages/_app';

interface MeldekortKnapperProps {
  håndterEndreMeldekort: () => void;
  meldekortId: string;
}

export const MeldekortKnapper = ({
  håndterEndreMeldekort,
  meldekortId,
}: MeldekortKnapperProps) => {
  const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);
  const { onGodkjennMeldekort, isMeldekortMutating } =
    useGodkjennMeldekort(meldekortId);

  return (
    <HStack gap="3">
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
