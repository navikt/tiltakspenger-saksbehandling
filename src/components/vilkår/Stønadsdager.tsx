import React from 'react';
import { Loader, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import VilkårKort from './VilkårKort';
import VilkårHeader from './VilkårHeader';

const VilkårsvurderingAvStønadsdager = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  const stønadsDager = valgtBehandling.stønadsdager;

  return (
    <VStack gap="4">
      <VilkårHeader
        headertekst="Stønadsdager"
        lovdatatekst="Stønadsdager"
        paragraf="§6-1"
        lovdatalenke={
          'https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286'
        }
      />
      <VilkårKort
        saksopplysningsperiode={
          stønadsDager[0].antallDagerSaksopplysningerFraRegister.periode
        }
        kilde={stønadsDager[0].antallDagerSaksopplysningerFraRegister.kilde}
        utfall={null}
        vilkårTittel={'Stønadsdager'}
        grunnlag={stønadsDager[0].antallDagerSaksopplysningerFraRegister.antallDager.toString()}
        grunnlagHeader={'Antall dager'}
      />
    </VStack>
  );
};

export default VilkårsvurderingAvStønadsdager;
