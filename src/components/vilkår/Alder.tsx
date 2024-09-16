import { Loader, VStack } from '@navikt/ds-react';
import VilkårHeader from './VilkårHeader';
import VilkårKort from './VilkårKort';
import UtfallstekstMedIkon from './UtfallstekstMedIkon';
import { useHentAlder } from '../../hooks/vilkår/useHentAlder';
import { formaterDatotekst } from '../../utils/date';
import { useContext } from 'react';
import { BehandlingContext } from '../layout/FørstegangsbehandlingLayout';
import Varsel from '../varsel/Varsel';

const Alder = () => {
  const { behandlingId } = useContext(BehandlingContext);
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
        headertekst={'Alder'}
        lovdatatekst={alderVilkår.vilkårLovreferanse.beskrivelse}
        lovdatalenke={
          'https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286'
        }
        paragraf={alderVilkår.vilkårLovreferanse.paragraf}
      />
      <UtfallstekstMedIkon utfall={alderVilkår.samletUtfall} />
      <VilkårKort
        saksopplysningsperiode={alderVilkår.utfallperiode}
        kilde={alderVilkår.avklartSaksopplysning.kilde}
        utfall={alderVilkår.samletUtfall}
        vilkårTittel={'Alder'}
        grunnlag={[
          {
            header: 'Fødselsfato',
            data: formaterDatotekst(
              alderVilkår.avklartSaksopplysning.fødselsdato,
            ),
          },
        ]}
      />
    </VStack>
  );
};

export default Alder;
