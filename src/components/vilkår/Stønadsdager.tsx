import React, { useContext } from 'react';
import { Loader, VStack } from '@navikt/ds-react';
import VilkårKort from './VilkårKort';
import VilkårHeader from './VilkårHeader';
import Varsel from '../varsel/Varsel';
import { BehandlingContext } from '../layout/FørstegangsbehandlingLayout';
import { useHentStønadsdager } from '../../hooks/vilkår/useHentStønadsdager';

const Stønadsdager = () => {
    const { behandlingId } = useContext(BehandlingContext);
    const { stønadsdager, isLoading, error } = useHentStønadsdager(behandlingId);

    if (isLoading || !stønadsdager) return <Loader />;
    else if (error)
        return (
            <Varsel
                variant="error"
                melding={`Kunne ikke hente stønadsdager (${error.status} ${error.info})`}
            />
        );
    const { antallDager, kilde, periode, tiltakNavn } = stønadsdager.registerSaksopplysning;
    return (
        <VStack gap="4">
            <VilkårHeader
                headertekst="Stønadsdager"
                lovdatatekst={stønadsdager.lovreferanse.beskrivelse}
                paragraf={stønadsdager.lovreferanse.paragraf}
                lovdatalenke={'https://lovdata.no/forskrift/2013-11-04-1286/§6'}
            />
            <VilkårKort
                saksopplysningsperiode={periode}
                kilde={kilde}
                utfall={null}
                grunnlag={[
                    { header: 'Tiltak', data: tiltakNavn },
                    {
                        header: 'Antall dager per meldeperiode',
                        data: antallDager.toString(),
                    },
                ]}
            />
        </VStack>
    );
};

export default Stønadsdager;
