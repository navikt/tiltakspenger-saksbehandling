import React, { useContext } from 'react';
import { VStack } from '@navikt/ds-react';
import VilkårKort from './VilkårKort';
import VilkårHeader from './VilkårHeader';
import { BehandlingContext } from '../layout/SaksbehandlingLayout';
import Varsel from '../varsel/Varsel';

const VilkårsvurderingAvStønadsdager = () => {
  const { behandlingId } = useContext(BehandlingContext);

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
      <Varsel variant="warning" melding={`Mangler data på stønadsdager`} />
      {/*
      <VilkårKort
        saksopplysningsperiode={}
        kilde={}
        utfall={null}
        vilkårTittel={'Stønadsdager'}
        grunnlag={[{ header: 'Antall dager', data: 'x' }]}
      />
*/}
    </VStack>
  );
};

export default VilkårsvurderingAvStønadsdager;
