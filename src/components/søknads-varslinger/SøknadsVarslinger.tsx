import { Alert, Heading } from '@navikt/ds-react';

interface SøknadsVarslingerProps {
  fritekst: string;
}

function SøknadsVarslinger({ fritekst }: SøknadsVarslingerProps) {
  return (
    <>
      <Alert variant="info">
        Foreløpig har vi ikke alle opplysninger til å vurdere søknaden.
      </Alert>
      {fritekst && (
        <Alert variant="info">
          Bruker har fylt ut tilleggsopplysninger i søknaden.
        </Alert>
      )}
    </>
  );
}

export default SøknadsVarslinger;
