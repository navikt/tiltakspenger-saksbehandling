import React from 'react';
import { Loader, VStack } from '@navikt/ds-react';
import router from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import VilkårHeader from './VilkårHeader';
import VilkårKort from './VilkårKort';
import UtfallstekstMedIkon from './UtfallstekstMedIkon';

const VilkårsvurderingAvTiltaksdeltagelse = () => {
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  const tiltak = valgtBehandling.tiltaksdeltagelsesaksopplysninger;

  return (
    <VStack gap="4">
      <VilkårHeader
        headertekst={'Tiltaksdeltagelse'}
        lovdatatekst={tiltak.vilkårLovreferanse.beskrivelse}
        lovdatalenke={
          'https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286'
        }
        paragraf={tiltak.vilkårLovreferanse.paragraf}
      />
      {tiltak.saksopplysninger.map(
        ({ periode, navn, girRett, kilde, deltagelseUtfall }) => {
          return (
            <>
              <UtfallstekstMedIkon samletUtfall={deltagelseUtfall} />
              <VilkårKort
                key={navn}
                saksopplysningsperiode={periode}
                kilde={kilde}
                utfall={deltagelseUtfall}
                vilkårTittel={tiltak.vilkår}
                grunnlag={girRett ? 'Ja' : 'nei'}
                grunnlagHeader={'Gir rett'}
              />
            </>
          );
        },
      )}
    </VStack>
  );
};

export default VilkårsvurderingAvTiltaksdeltagelse;
