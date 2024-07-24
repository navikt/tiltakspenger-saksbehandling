import React, { useContext } from 'react';
import { Loader, VStack } from '@navikt/ds-react';
import UtfallstekstMedIkon from './UtfallstekstMedIkon';
import VilkårHeader from './VilkårHeader';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import VilkårKort from './VilkårKort';
import { formaterDatotekst } from '../../utils/date';
import { BehandlingContext } from '../layout/SaksbehandlingLayout';

const FristForFramsettingAvKrav = () => {
  const { behandlingId } = useContext(BehandlingContext);
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }
  const saksopplysning = valgtBehandling.kravdatoSaksopplysninger;

  if (!saksopplysning) return <Loader />;

  return (
    <VStack gap="4">
      <VilkårHeader
        headertekst={'Frist for framsetting av krav'}
        lovdatatekst={saksopplysning.lovreferanse.beskrivelse}
        lovdatalenke={
          'https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286'
        }
        paragraf={saksopplysning.lovreferanse.paragraf}
      />
      <UtfallstekstMedIkon samletUtfall={saksopplysning.samletUtfall} />
      <VilkårKort
        saksopplysningsperiode={valgtBehandling.vurderingsperiode}
        kilde={saksopplysning.opprinneligKravdato.kilde}
        utfall={saksopplysning.samletUtfall}
        vilkårTittel={'Frist for framsetting av krav'}
        grunnlag={formaterDatotekst(
          saksopplysning.opprinneligKravdato.kravdato,
        )}
        grunnlagHeader={'Kravdato'}
      />
    </VStack>
  );
};

export default FristForFramsettingAvKrav;
