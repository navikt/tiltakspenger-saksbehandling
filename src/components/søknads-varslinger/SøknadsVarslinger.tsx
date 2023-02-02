import { Alert, Heading } from '@navikt/ds-react';

interface SøknadsVarslingerProps {
    fritekst: string;
    kanBehandles?: boolean;
}

function SøknadsVarslinger({ fritekst, kanBehandles }: SøknadsVarslingerProps) {
    return (
        <div>
            {!kanBehandles && (
                <Alert variant="warning" style={{ marginTop: '1rem' }}>
                    <Heading spacing size="small" level="3">
                        Søknaden mangler data fra alle relevante systemer
                    </Heading>
                    Vent noen minutter og oppdater siden
                </Alert>
            )}
            {kanBehandles && (
                <>
                    <Alert variant="info" style={{ marginTop: '1rem' }}>
                        Foreløpig har vi ikke alle opplysninger til å vurdere søknaden.
                    </Alert>
                    {fritekst && (
                        <Alert variant="info" style={{ marginTop: '1rem' }}>
                            Bruker har fylt ut tilleggsopplysninger i søknaden.
                        </Alert>
                    )}
                </>
            )}
        </div>
    );
}

export default SøknadsVarslinger;
