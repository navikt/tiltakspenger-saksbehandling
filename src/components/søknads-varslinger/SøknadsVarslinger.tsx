import { Alert, Heading } from '@navikt/ds-react';

interface SøknadsVarslingerProps {
    fritekst: string;
    klarForBehandling?: boolean;
}

function SøknadsVarslinger({ fritekst, klarForBehandling }: SøknadsVarslingerProps) {
    if (!klarForBehandling) {
        return (
            <Alert variant="warning">
                <Heading spacing size="small" level="3">
                    Søknaden mangler data fra alle relevante systemer
                </Heading>
                Vent noen minutter og oppdater siden
            </Alert>
        );
    }
    return (
        <>
            <Alert variant="info">Foreløpig har vi ikke alle opplysninger til å vurdere søknaden.</Alert>
            {fritekst && <Alert variant="info">Bruker har fylt ut tilleggsopplysninger i søknaden.</Alert>}
        </>
    );
}

export default SøknadsVarslinger;
