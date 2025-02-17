import { Loader, VStack } from '@navikt/ds-react';
import VilkårHeader from './VilkårHeader';
import VilkårKort from './VilkårKort';
import { useHentAlder } from '../../hooks/vilkår/useHentAlder';
import { formaterDatotekst } from '../../utils/date';
import { useContext } from 'react';
import { BehandlingContextDeprecated } from '../layout/FørstegangsbehandlingLayout';
import Varsel from '../varsel/Varsel';
import { lagUtfallstekst } from '../../utils/tekstformateringUtils';
import { UtfallIkon } from '../utfallikon/UtfallIkon';
import IkonMedTekst from '../ikon-med-tekst/IkonMedTekst';

const Alder = () => {
    const { behandlingId } = useContext(BehandlingContextDeprecated);
    const { alderVilkår, isLoading, error } = useHentAlder(behandlingId);

    if (isLoading || !alderVilkår) {
        return <Loader />;
    } else if (error)
        return (
            <Varsel
                variant="error"
                melding={`Kunne ikke hente aldervilkår (${error.status} ${error.info})`}
            />
        );

    return (
        <VStack gap="4">
            <VilkårHeader
                headertekst={'Over 18 år'}
                lovdatatekst={alderVilkår.vilkårLovreferanse.beskrivelse}
                lovdatalenke={'https://lovdata.no/forskrift/2013-11-04-1286/§3'}
                paragraf={alderVilkår.vilkårLovreferanse.paragraf}
            />
            <IkonMedTekst
                iconRenderer={() => <UtfallIkon utfall={alderVilkår.samletUtfall} />}
                text={lagUtfallstekst(alderVilkår.samletUtfall)}
            />
            <VilkårKort
                saksopplysningsperiode={alderVilkår.utfallperiode}
                kilde={alderVilkår.avklartSaksopplysning.kilde}
                utfall={alderVilkår.samletUtfall}
                grunnlag={[
                    {
                        header: 'Fødselsdato',
                        data: formaterDatotekst(alderVilkår.avklartSaksopplysning.fødselsdato),
                    },
                ]}
            />
        </VStack>
    );
};

export default Alder;
