import { Loader, VStack } from '@navikt/ds-react';
import VilkårHeader from './VilkårHeader';
import VilkårKort from './VilkårKort';
import { useHentInstitusjonsopphold } from '../../hooks/vilkår/useHentInstitusjonsopphold';
import { useContext } from 'react';
import { BehandlingContext } from '../layout/FørstegangsbehandlingLayout';
import Varsel from '../varsel/Varsel';
import { lagUtfallstekst } from '../../utils/tekstformateringUtils';
import IkonMedTekst from '../ikon-med-tekst/IkonMedTekst';
import { UtfallIkon } from '../utfallikon/UtfallIkon';

const Institusjonsopphold = () => {
    const { behandlingId } = useContext(BehandlingContext);
    const { institusjonsopphold, isLoading, error } = useHentInstitusjonsopphold(behandlingId);

    if (isLoading || !institusjonsopphold) {
        return <Loader />;
    } else if (error)
        return (
            <Varsel
                variant="error"
                melding={`Kunne ikke hente institusjonsoppholdvilkår (${error.status} ${error.info})`}
            />
        );

    return (
        <VStack gap="4">
            <VilkårHeader
                headertekst={'Opphold i institusjon'}
                lovdatatekst="Opphold i institusjon, fengsel mv."
                lovdatalenke={'https://lovdata.no/forskrift/2013-11-04-1286/§9'}
                paragraf={'§9'}
            />
            <IkonMedTekst
                iconRenderer={() => <UtfallIkon utfall={institusjonsopphold.samletUtfall} />}
                text={lagUtfallstekst(institusjonsopphold.samletUtfall)}
            />
            <VilkårKort
                saksopplysningsperiode={institusjonsopphold.utfallperiode}
                kilde={institusjonsopphold.søknadSaksopplysning.kilde}
                utfall={institusjonsopphold.samletUtfall}
                grunnlag={[
                    {
                        header: 'Opphold',
                        data: institusjonsopphold.samletUtfall === 'OPPFYLT' ? 'Nei' : 'Ja',
                    },
                ]}
            />
        </VStack>
    );
};

export default Institusjonsopphold;
