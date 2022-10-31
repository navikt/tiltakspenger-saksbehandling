import React from 'react';
import { SøknadResponse } from '../../types/Søknad';
import SøknadDetails from '../søknad-details/SøknadDetails';
import RegistrertTiltakDetails from '../registrert-tiltak-details/RegistrertTiltakDetails';

interface SøknadSummarySectionProps {
    søknadResponse: SøknadResponse;
}

const SøknadSummarySection = ({ søknadResponse: { søknad, registrerteTiltak } }: SøknadSummarySectionProps) => {
    return (
        <div className="">
            <SøknadDetails søknad={søknad} />
            {registrerteTiltak.map((registrertTiltak) => {
                return <RegistrertTiltakDetails registrertTiltak={registrertTiltak} />;
            })}
        </div>
    );
};

export default SøknadSummarySection;
