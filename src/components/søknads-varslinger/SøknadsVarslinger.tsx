import { Alert } from '@navikt/ds-react';

interface SøknadsVarslingerProps {
    fritekst: string;
}

function SøknadsVarslinger({ fritekst }: SøknadsVarslingerProps) {
    return (
        <div>
            <Alert variant="info" style={{ marginTop: '1rem' }}>
                Foreløpig har vi ikke alle opplysninger til å vurdere søknaden.
            </Alert>
            {fritekst && (
                <Alert variant="info" style={{ marginTop: '1rem' }}>
                    Bruker har fylt ut tilleggsopplysninger i søknaden.
                </Alert>
            )}
        </div>
    );
}

export default SøknadsVarslinger;
