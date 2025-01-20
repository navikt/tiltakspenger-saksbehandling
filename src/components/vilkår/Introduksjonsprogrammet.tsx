import { Loader, VStack } from '@navikt/ds-react';
import VilkårHeader from './VilkårHeader';
import { useHentIntroduksjonsprogrammet } from '../../hooks/vilkår/useHentIntroduksjonsprogrammet';
import { Deltagelse } from '../../types/KvpTypes';
import VilkårKort from './VilkårKort';
import { useContext } from 'react';
import { BehandlingContext } from '../layout/FørstegangsbehandlingLayout';
import Varsel from '../varsel/Varsel';
import IkonMedTekst from '../ikon-med-tekst/IkonMedTekst';
import { lagUtfallstekst } from '../../utils/tekstformateringUtils';
import { UtfallIkon } from '../utfallikon/UtfallIkon';

const Introduksjonsprogrammet = () => {
    const { behandlingId } = useContext(BehandlingContext);
    const { intro, isLoading, error } = useHentIntroduksjonsprogrammet(behandlingId);

    if (isLoading || !intro) {
        return <Loader />;
    } else if (error)
        return (
            <Varsel
                variant="error"
                melding={`Kunne ikke introduksjonsprogramvilkår (${error.status} ${error.info})`}
            />
        );

    const deltagelse = intro.avklartSaksopplysning.periodeMedDeltagelse.deltagelse;

    return (
        <VStack gap="4">
            <VilkårHeader
                headertekst={'Introduksjonsprogrammet'}
                lovdatatekst={intro.vilkårLovreferanse.beskrivelse}
                paragraf={intro.vilkårLovreferanse.paragraf}
                lovdatalenke={'https://lovdata.no/forskrift/2013-11-04-1286/§7'}
            />
            <IkonMedTekst
                iconRenderer={() => <UtfallIkon utfall={intro.samletUtfall} />}
                text={lagUtfallstekst(intro.samletUtfall)}
            />
            <VilkårKort
                saksopplysningsperiode={intro.utfallperiode}
                kilde={intro.avklartSaksopplysning.kilde}
                utfall={intro.samletUtfall}
                grunnlag={[{ header: 'Deltar', data: deltagelseTekst(deltagelse) }]}
            />
        </VStack>
    );
};

const deltagelseTekst = (deltagelse: Deltagelse): string => {
    switch (deltagelse) {
        case Deltagelse.DELTAR:
            return 'Ja';
        case Deltagelse.DELTAR_IKKE:
            return 'Nei';
    }
};

export default Introduksjonsprogrammet;
