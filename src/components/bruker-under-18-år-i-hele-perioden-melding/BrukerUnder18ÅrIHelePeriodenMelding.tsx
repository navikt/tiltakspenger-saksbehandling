import React from 'react';
import { Alert } from '@navikt/ds-react';

const BrukerUnder18ÅrIHelePeriodenMelding = () => {
  return (
    <Alert variant="error" style={{ marginTop: '1rem' }}>
      <strong>
        Bruker er under 18 år i hele perioden det søkes tiltakspenger for
      </strong>
    </Alert>
  );
};

export default BrukerUnder18ÅrIHelePeriodenMelding;
