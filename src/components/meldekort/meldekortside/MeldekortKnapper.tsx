import { PencilWritingIcon } from '@navikt/aksel-icons';
import { Button, HStack } from '@navikt/ds-react';
import { useContext } from 'react';
import { useGodkjennMeldekort } from '../../../hooks/meldekort/useGodkjennMeldekort';
import { SaksbehandlerContext } from '../../../pages/_app';
import Varsel from '../../varsel/Varsel';
import { MeldekortDager } from './MeldekortSide';
import { MeldekortStatus } from '../../../utils/meldekortStatus';
import { MeldekortDag, MeldekortDagDTO } from '../../../types/MeldekortTypes';

interface MeldekortKnapperProps {
  håndterEndreMeldekort: () => void;
  meldekortId: string;
  meldekortDager: MeldekortDager;
}

export const MeldekortKnapper = ({
  håndterEndreMeldekort,
  meldekortId,
  meldekortDager,
}: MeldekortKnapperProps) => {
  const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);
  const { onGodkjennMeldekort, isMeldekortMutating, error } =
    useGodkjennMeldekort(meldekortId, meldekortDager);

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
            meldekortId: meldekortId,
            meldekortDager: Object.entries(meldekortDager).map(
              ([dato, status]) => ({ dato, status: status as MeldekortStatus }),
            ),
          })
        }
      >
        Godkjenn meldekortperiode
      </Button>
    </HStack>
  );
};
