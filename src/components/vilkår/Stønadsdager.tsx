import React, { useContext } from 'react';
import { Button, HStack, Loader, VStack } from '@navikt/ds-react';
import VilkårKort from './VilkårKort';
import VilkårHeader from './VilkårHeader';
import Varsel from '../varsel/Varsel';
import { useHentStønadsdager } from '../../hooks/useHentStønadsdager';
import { BehandlingContext } from '../layout/FørstegangsbehandlingLayout';
import router from 'next/router';

const Stønadsdager = () => {
  const { behandlingId } = useContext(BehandlingContext);
  const { stønadsdager, isLoading, error } = useHentStønadsdager(behandlingId);

  if (isLoading || !stønadsdager) return <Loader />;
  else if (error)
    return (
      <Varsel
        variant="error"
        melding={`Kunne ikke hente stønadsdager (${error.status} ${error.info})`}
      />
    );
  const { antallDager, kilde, periode, tiltakNavn } =
    stønadsdager.registerSaksopplysning;
  return (
    <VStack gap="4">
      <VilkårHeader
        headertekst="Stønadsdager"
        lovdatatekst={stønadsdager.lovreferanse.beskrivelse}
        paragraf={stønadsdager.lovreferanse.paragraf}
        lovdatalenke={
          'https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286'
        }
      />
      <VilkårKort
        saksopplysningsperiode={periode}
        kilde={kilde}
        utfall={null}
        vilkårTittel={'Stønadsdager'}
        grunnlag={[
          { header: 'Tiltak', data: tiltakNavn },
          { header: 'Antall dager i uken', data: antallDager.toString() },
        ]}
      />
      <HStack>
        <Button
          onClick={() =>
            router.push(`/behandling/${behandlingId}/oppsummering`)
          }
        >
          Gå til oppsummering
        </Button>
      </HStack>
    </VStack>
  );
};

export default Stønadsdager;
