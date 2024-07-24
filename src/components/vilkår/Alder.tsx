import { Loader, VStack } from '@navikt/ds-react';
import VilkårHeader from './VilkårHeader';
import VilkårKort from './VilkårKort';
import UtfallstekstMedIkon from './UtfallstekstMedIkon';
import { useHentAlder } from '../../hooks/vilkår/useHentAlder';
import { formaterDatotekst } from '../../utils/date';
import { useContext } from 'react';
import { BehandlingContext } from '../layout/SaksbehandlingLayout';

const Alder = () => {
  const { behandlingId } = useContext(BehandlingContext);
  const { alderVilkår, isLoading } = useHentAlder(behandlingId);

  if (isLoading || !alderVilkår) {
    return <Loader />;
  }

  const vurderingsperiode = alderVilkår.vurderingsperiode;

  return (
    <VStack gap="4">
      <VilkårHeader
        headertekst={'Alder'}
        lovdatatekst={alderVilkår.vilkårLovreferanse.beskrivelse}
        lovdatalenke={
          'https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286'
        }
        paragraf={alderVilkår.vilkårLovreferanse.paragraf}
      />
      <UtfallstekstMedIkon samletUtfall={alderVilkår.samletUtfall} />
      <VilkårKort
        saksopplysningsperiode={vurderingsperiode}
        kilde={alderVilkår.avklartSaksopplysning.kilde}
        utfall={alderVilkår.samletUtfall}
        vilkårTittel={'Alder'}
        grunnlag={formaterDatotekst(
          alderVilkår.avklartSaksopplysning.fødselsdato,
        )}
        grunnlagHeader={'Fødselsdato'}
      />
    </VStack>
  );
};

export default Alder;
