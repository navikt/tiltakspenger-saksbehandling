import { Loader, VStack } from '@navikt/ds-react';
import VilkårHeader from './VilkårHeader';
import VilkårKort from './VilkårKort';
import { useHentKvp } from '../../hooks/vilkår/useHentKvp';
import { useContext } from 'react';
import { BehandlingContext } from '../layout/FørstegangsbehandlingLayout';
import Varsel from '../varsel/Varsel';
import { deltagelseTekst, lagUtfallstekst } from '../../utils/tekstformateringUtils';
import IkonMedTekst from '../ikon-med-tekst/IkonMedTekst';
import { UtfallIkon } from '../utfallikon/UtfallIkon';

const Kvalifiseringsprogrammet = () => {
    const { behandlingId } = useContext(BehandlingContext);
    const { kvp, isLoading, error } = useHentKvp(behandlingId);

    if (isLoading || !kvp) {
        return <Loader />;
    } else if (error)
        return (
            <Varsel
                variant="error"
                melding={`Kunne ikke introduksjonsprogramvilkår (${error.status} ${error.info})`}
            />
        );

    const deltagelse = kvp.avklartSaksopplysning.periodeMedDeltagelse.deltagelse;

    return (
        <VStack gap="4">
            <VilkårHeader
                headertekst={'Kvalifiseringsprogrammet'}
                lovdatatekst={kvp.vilkårLovreferanse.beskrivelse}
                paragraf={kvp.vilkårLovreferanse.paragraf}
                lovdatalenke={'https://lovdata.no/forskrift/2013-11-04-1286/§7'}
            />
            <IkonMedTekst
                iconRenderer={() => <UtfallIkon utfall={kvp.samletUtfall} />}
                text={lagUtfallstekst(kvp.samletUtfall)}
            />
            <VilkårKort
                saksopplysningsperiode={kvp.utfallperiode}
                kilde={kvp.avklartSaksopplysning.kilde}
                utfall={kvp.samletUtfall}
                grunnlag={[{ header: 'Deltar', data: deltagelseTekst(deltagelse) }]}
            />
        </VStack>
    );
};

export default Kvalifiseringsprogrammet;
