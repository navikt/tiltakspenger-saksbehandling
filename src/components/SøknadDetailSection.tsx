import React from 'react';
import Søknad from '../types/Søknad';
import { Heading } from '@navikt/ds-react';

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
        </div>
    );
};

export default SøknadDetailSection;
