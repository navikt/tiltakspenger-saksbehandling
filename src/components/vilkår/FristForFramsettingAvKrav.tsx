import React, { useContext } from 'react';
import { Loader, VStack } from '@navikt/ds-react';
import UtfallstekstMedIkon from './UtfallstekstMedIkon';
import VilkårHeader from './VilkårHeader';
import VilkårKort from './VilkårKort';
import { formaterDatotekst } from '../../utils/date';
import { BehandlingContext } from '../layout/SaksbehandlingLayout';
import { useHentKravfrist } from '../../hooks/vilkår/useHentKravfrist';

const FristForFramsettingAvKrav = () => {
  const { behandlingId } = useContext(BehandlingContext);
  const { kravfristVilkår, isLoading } = useHentKravfrist(behandlingId);

  if (isLoading || !kravfristVilkår) {
    return <Loader />;
  }

  return (
    <VStack gap="4">
      <VilkårHeader
        headertekst={'Frist for framsetting av krav'}
        lovdatatekst={kravfristVilkår.vilkårLovreferanse.beskrivelse}
        lovdatalenke={
          'https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286'
        }
        paragraf={kravfristVilkår.vilkårLovreferanse.paragraf}
      />
      <UtfallstekstMedIkon samletUtfall={kravfristVilkår.samletUtfall} />
      <VilkårKort
        saksopplysningsperiode={kravfristVilkår.utfallperiode}
        kilde={kravfristVilkår.avklartSaksopplysning.kilde}
        utfall={kravfristVilkår.samletUtfall}
        vilkårTittel={'Frist for framsetting av krav'}
        grunnlag={[
          {
            header: 'Kravdato',
            data: formaterDatotekst(
              kravfristVilkår.avklartSaksopplysning.kravdato,
            ),
          },
        ]}
      />
    </VStack>
  );
};

export default FristForFramsettingAvKrav;
