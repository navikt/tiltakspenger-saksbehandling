import React from 'react';
import { Heading } from '@navikt/ds-react';
import { Behandling } from '../../types/Behandling';
import styles from './VilkårsvurderingDetails.module.css';
import Personalia from '../../types/Personalia';
import SøknadsVarslinger from '../søknads-varslinger/SøknadsVarslinger';
import Vilkårsvarslinger from '../vilkårsvarslinger/Vilkårsvarslinger';
import VilkårAccordions from '../vilkår-accordions/VilkårAccordions';

interface VilkårsvurderingDetailsProps {
    behandling: Behandling;
    personalia: Personalia;
}

const VilkårsvurderingDetails = ({ behandling, personalia }: VilkårsvurderingDetailsProps) => {
    const {
        søknad: { fritekst },
    } = behandling;
    const { fødselsdato } = personalia;

    return (
        <div>
            <SøknadsVarslinger fritekst={fritekst} />
            <Vilkårsvarslinger behandling={behandling} fødselsdato={fødselsdato} />
            <VilkårAccordions behandling={behandling} fødselsdato={fødselsdato} fritekst={fritekst} />
        </div>
    );
};

export default VilkårsvurderingDetails;
