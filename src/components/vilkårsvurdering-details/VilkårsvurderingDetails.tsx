import React from 'react';
import { Heading } from '@navikt/ds-react';
import { Behandling, KlarBehandling } from '../../types/Behandling';
import styles from './VilkårsvurderingDetails.module.css';
import Personalia from '../../types/Personalia';
import SøknadsVarslinger from '../søknads-varslinger/SøknadsVarslinger';
import Vilkårsvarslinger from '../vilkårsvarslinger/Vilkårsvarslinger';
import VilkårAccordions from '../vilkår-accordions/VilkårAccordions';

interface VilkårsvurderingDetailsProps {
    behandling: Behandling | KlarBehandling;
    personalia: Personalia;
}

const VilkårsvurderingDetails = ({ behandling, personalia }: VilkårsvurderingDetailsProps) => {
    const {
        klarForBehandling,
        søknad: { fritekst },
    } = behandling;
    const { fødselsdato } = personalia;

    return (
        <div className={styles.vilkårsvurderingDetails}>
            <Heading level="1" size="small" className={styles.vilkårsvurderingDetails__header}>
                Søknad
            </Heading>
            <SøknadsVarslinger fritekst={fritekst} klarForBehandling={klarForBehandling} />
            {klarForBehandling && (
                <>
                    <Vilkårsvarslinger behandling={behandling as KlarBehandling} fødselsdato={fødselsdato} />
                    <VilkårAccordions
                        behandling={behandling as KlarBehandling}
                        fødselsdato={fødselsdato}
                        fritekst={fritekst}
                    />
                </>
            )}
        </div>
    );
};

export default VilkårsvurderingDetails;
