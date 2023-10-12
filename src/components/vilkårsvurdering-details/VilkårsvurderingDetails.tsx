import React from 'react';
import { Behandling } from '../../types/Behandling';
import Personalia from '../../types/Personalia';
import SøknadsVarslinger from '../søknads-varslinger/SøknadsVarslinger';
import Vilkårsvarslinger from '../vilkårsvarslinger/Vilkårsvarslinger';
import VilkårAccordions from '../vilkår-accordions/VilkårAccordions';
import OppdatertDataTilgjengeligMelding from '../oppdatert-data-tilgjenglig-melding/OppdatertDataTilgjengeligMelding';

interface VilkårsvurderingDetailsProps {
    behandling: Behandling;
    personalia: Personalia;
    søkerId: string;
}

const VilkårsvurderingDetails = ({ behandling, personalia, søkerId }: VilkårsvurderingDetailsProps) => {
/*    Komponent ikke i bruk.

    const {
        søknad: { fritekst, søknadId },
        hash,
    } = behandling;
    const { fødselsdato } = personalia;

    return (
        <div>
            <OppdatertDataTilgjengeligMelding søkerId={søkerId} søknadId={søknadId} hash={hash} />
            <SøknadsVarslinger fritekst={fritekst} />
            <Vilkårsvarslinger behandling={behandling} fødselsdato={fødselsdato} />
            <VilkårAccordions behandling={behandling} fødselsdato={fødselsdato} fritekst={fritekst} />
        </div>
    );*/
};

export default VilkårsvurderingDetails;
