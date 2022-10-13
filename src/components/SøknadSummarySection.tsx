import React from 'react';
import Søknad from '../types/Søknad';
import { Heading } from '@navikt/ds-react';

interface SøknadSummarySectionProps {
    søknad: Søknad;
}

const SøknadSummarySection = ({
    søknad: {
        prosent,
        registrertTiltak: {
            beskrivelse,
            periode: { fom, tom },
        },
        status,
        søknadsdato,
        antallDager,
    },
}: SøknadSummarySectionProps) => (
    <div style={{ padding: '1rem' }}>
        <Heading size="small" level="1">
            Oppsummering
        </Heading>
        <Heading size="xsmall" level="2">
            Søknad
        </Heading>
        <p>Søknadsdato {søknadsdato}</p>
        <p>
            {fom} - {tom}
        </p>
        <p>{beskrivelse}</p>
        <p>
            {antallDager} dager i uka ({prosent}%)
        </p>
        <p>{status}</p>
    </div>
);

export default SøknadSummarySection;
