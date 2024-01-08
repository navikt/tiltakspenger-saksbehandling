import React from 'react';
import { Alert } from '@navikt/ds-react';

interface ErrorMessageProps {
  feilmelding: string;
}

const Feilmelding = ({ feilmelding: feilmelding }: ErrorMessageProps) => {
  return (
    <Alert data-testid="nav-search-error" variant="error" fullWidth>
      {feilmelding}
    </Alert>
  );
};

export default Feilmelding;
