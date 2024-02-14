import { PencilWritingIcon } from '@navikt/aksel-icons';
import { Button, HStack } from '@navikt/ds-react';

interface MeldekortKnapperProps {
  håndterEndreMeldekort: () => void;
  håndterGodkjennMeldekort: () => void;
}

export const MeldekortKnapper = ({
  håndterEndreMeldekort,
  håndterGodkjennMeldekort,
}: MeldekortKnapperProps) => (
  <HStack gap="3">
    <Button
      icon={<PencilWritingIcon />}
      variant="tertiary"
      size="small"
      onClick={() => håndterEndreMeldekort()}
    >
      Endre meldekortperiode
    </Button>
    <Button size="small" onClick={håndterGodkjennMeldekort}>
      Godkjenn meldekortperiode
    </Button>
  </HStack>
);
