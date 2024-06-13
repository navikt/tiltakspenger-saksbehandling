import React from 'react';
import { BodyShort, HStack, Loader } from '@navikt/ds-react';
import router from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import { UtfallIkon } from '../utfall-ikon/UtfallIkon';
import StegHeader from './StegHeader';
import { finnUtfallTekst } from '../../utils/tekstformateringUtils';
import StegKort from './StegKort';

const VilkårsvurderingAvTiltaksdeltagelse = () => {
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  const tiltak = valgtBehandling.tiltaksdeltagelsesaksopplysninger;

  return (
    <>
      <StegHeader
        headertekst={tiltak.vilkår}
        lovdatatekst={tiltak.vilkårLovreferanse.beskrivelse}
        lovdatalenke={
          'https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286'
        }
        paragraf={tiltak.vilkårLovreferanse.paragraf}
      />
      <HStack gap="3" align="center" style={{ marginBottom: '1em' }}>
        <UtfallIkon utfall={tiltak.saksopplysninger[0].deltagelseUtfall} />
        <BodyShort>
          {`Vilkåret er ${finnUtfallTekst(tiltak.saksopplysninger[0].deltagelseUtfall)} for hele eller deler av perioden`}
        </BodyShort>
      </HStack>
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
    </>
  );
};

export default VilkårsvurderingAvTiltaksdeltagelse;
