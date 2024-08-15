import React, { useContext } from 'react';
import { Loader, VStack } from '@navikt/ds-react';
import VilkårHeader from './VilkårHeader';
import VilkårKort from './VilkårKort';
import UtfallstekstMedIkon from './UtfallstekstMedIkon';
import { BehandlingContext } from '../layout/SaksbehandlingLayout';
import { useHentTiltakDeltagelse } from '../../hooks/vilkår/useHentTiltaksdeltagelse';
import Varsel from '../varsel/Varsel';

const Tiltaksdeltagelse = () => {
  const { behandlingId } = useContext(BehandlingContext);
  const { tiltakDeltagelse, isLoading, error } =
    useHentTiltakDeltagelse(behandlingId);

  if (isLoading || !tiltakDeltagelse) {
    return <Loader />;
  } else if (error)
    return (
      <Varsel
        variant="error"
        melding={`Kunne ikke introduksjonsprogramvilkår (${error.status} ${error.info})`}
      />
    );

  const { status, tiltakNavn, kilde } = tiltakDeltagelse.registerSaksopplysning;

  return (
    <VStack gap="4">
      <VilkårHeader
        headertekst={'Tiltaksdeltagelse'}
        lovdatatekst={tiltakDeltagelse.vilkårLovreferanse.beskrivelse}
        lovdatalenke={
          'https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286'
        }
        paragraf={tiltakDeltagelse.vilkårLovreferanse.paragraf}
      />

      <UtfallstekstMedIkon utfall={tiltakDeltagelse.samletUtfall} />
      <VilkårKort
        key={tiltakNavn}
        saksopplysningsperiode={tiltakDeltagelse.utfallperiode}
        kilde={kilde}
        utfall={tiltakDeltagelse.samletUtfall}
        vilkårTittel={'Tiltaksdeltagelse'}
        grunnlag={[
          { header: 'Type tiltak', data: tiltakNavn },
          { header: 'Siste status', data: status },
        ]}
      />
    </VStack>
  );
};

export default Tiltaksdeltagelse;
