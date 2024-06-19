import React from 'react';
import { Loader, VStack } from '@navikt/ds-react';
import router from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import StegHeader from './StegHeader';
import StegKort from './StegKort';
import UtfallstekstMedIkon from './UtfallstekstMedIkon';
import { Utfall } from '../../types/Utfall';

const VilkårsvurderingAvTiltaksdeltagelse = () => {
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  const tiltak = valgtBehandling.tiltaksdeltagelsesaksopplysninger;

  return (
    <VStack gap="4">
      <StegHeader
        headertekst={'Tiltaksdeltagelse'}
        lovdatatekst={tiltak.vilkårLovreferanse.beskrivelse}
        lovdatalenke={
          'https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286'
        }
        paragraf={tiltak.vilkårLovreferanse.paragraf}
      />
      <UtfallstekstMedIkon utfall={Utfall.KREVER_MANUELL_VURDERING} />
      {tiltak.saksopplysninger.map(
        ({ periode, navn, girRett, kilde, deltagelseUtfall }, i) => {
          return (
            <StegKort
              key={navn}
              editerbar={false}
              behandlingId={valgtBehandling.behandlingId}
              vurderingsperiode={valgtBehandling.vurderingsperiode}
              saksopplysningsperiode={periode}
              kilde={kilde}
              utfall={deltagelseUtfall}
              vilkår={tiltak.vilkår}
              vilkårTittel={tiltak.vilkår}
              grunnlag={girRett ? 'Ja' : 'nei'}
              grunnlagHeader={'Gir rett til tiltakspenger'}
            />
          );
        },
      )}
    </VStack>
  );
};

export default VilkårsvurderingAvTiltaksdeltagelse;
