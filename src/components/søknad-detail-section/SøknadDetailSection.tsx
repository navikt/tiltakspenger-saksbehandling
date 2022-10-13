import React from 'react';
import Søknad from '../../types/Søknad';
import { Alert, Heading } from '@navikt/ds-react';

interface SøknadDetailSectionProps {
    søknad: Søknad;
}

const SøknadDetailSection = (props: SøknadDetailSectionProps) => {
    return (
        <div style={{ padding: '1rem' }}>
            <Heading level="1" size="small">
                Søknad
            </Heading>
            <p>{props.søknad.registrertTiltak.beskrivelse}</p>
            <Alert variant="info" fullWidth style={{ width: '100%' }}>
                Foreløpig har vi ikke alle opplysninger til å vurdere søknaden
            </Alert>
        </div>
    );
};

export default SøknadDetailSection;
