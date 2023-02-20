import React from 'react';
import { Heading } from '@navikt/ds-react';
import { Behandling } from '../../types/Behandling';
import styles from './VilkårsvurderingDetails.module.css';
import Personalia from '../../types/Personalia';
import SøknadsVarslinger from '../søknads-varslinger/SøknadsVarslinger';
import Vilkårsvarslinger from '../vilkårsvarslinger/Vilkårsvarslinger';
import VilkårAccordions from '../vilkår-accordions/VilkårAccordions';
import OppdatertDataTilgjengeligMelding from '../oppdatert-data-tilgjenglig-melding/OppdatertDataTilgjengeligMelding';
import { KeyedMutator } from 'swr';
import Søker from '../../types/Søker';

interface VilkårsvurderingDetailsProps {
    behandling: Behandling;
    personalia: Personalia;
    søkerId: string;
}

const VilkårsvurderingDetails = ({ behandling, personalia, søkerId }: VilkårsvurderingDetailsProps) => {
    const {
        søknad: { fritekst },
    } = behandling;
    const { fødselsdato } = personalia;

    return (
        <div>
            <OppdatertDataTilgjengeligMelding søkerId={søkerId} behandling={behandling} />
            <SøknadsVarslinger fritekst={fritekst} />
            <Vilkårsvarslinger behandling={behandling} fødselsdato={fødselsdato} />
            <VilkårAccordions behandling={behandling} fødselsdato={fødselsdato} fritekst={fritekst} />
        </div>
    );
};

export default VilkårsvurderingDetails;
