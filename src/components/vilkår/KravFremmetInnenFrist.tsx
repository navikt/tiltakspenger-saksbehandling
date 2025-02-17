import React, { useContext } from 'react';
import { Loader, VStack } from '@navikt/ds-react';
import VilkårHeader from './VilkårHeader';
import VilkårKort from './VilkårKort';
import { formaterDatotekst } from '../../utils/date';
import { BehandlingContextDeprecated } from '../layout/FørstegangsbehandlingLayout';
import { useHentKravfrist } from '../../hooks/vilkår/useHentKravfrist';
import Varsel from '../varsel/Varsel';
import { lagUtfallstekst } from '../../utils/tekstformateringUtils';
import IkonMedTekst from '../ikon-med-tekst/IkonMedTekst';
import { UtfallIkon } from '../utfallikon/UtfallIkon';

const KravFremmetInnenFrist = () => {
    const { behandlingId } = useContext(BehandlingContextDeprecated);
    const { kravfristVilkår, isLoading, error } = useHentKravfrist(behandlingId);

    if (isLoading || !kravfristVilkår) {
        return <Loader />;
    } else if (error)
        return (
            <Varsel
                variant="error"
                melding={`Kunne ikke hente kravfristvilkår (${error.status} ${error.info})`}
            />
        );

    return (
        <VStack gap="4">
            <VilkårHeader
                headertekst={'Krav fremmet innen frist'}
                lovdatatekst={kravfristVilkår.vilkårLovreferanse.beskrivelse}
                lovdatalenke={'https://lovdata.no/forskrift/2013-11-04-1286/§11'}
                paragraf={kravfristVilkår.vilkårLovreferanse.paragraf}
            />
            <IkonMedTekst
                iconRenderer={() => <UtfallIkon utfall={kravfristVilkår.samletUtfall} />}
                text={lagUtfallstekst(kravfristVilkår.samletUtfall)}
            />
            <VilkårKort
                saksopplysningsperiode={kravfristVilkår.utfallperiode}
                kilde={kravfristVilkår.avklartSaksopplysning.kilde}
                utfall={kravfristVilkår.samletUtfall}
                grunnlag={[
                    {
                        header: 'Kravdato',
                        data: formaterDatotekst(kravfristVilkår.avklartSaksopplysning.kravdato),
                    },
                ]}
            />
        </VStack>
    );
};

export default KravFremmetInnenFrist;
