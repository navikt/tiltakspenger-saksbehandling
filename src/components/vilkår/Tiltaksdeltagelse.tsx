import React, { useContext } from 'react';
import { Loader, VStack } from '@navikt/ds-react';
import VilkårHeader from './VilkårHeader';
import VilkårKort from './VilkårKort';
import { BehandlingContext } from '../layout/FørstegangsbehandlingLayout';
import Varsel from '../varsel/Varsel';
import { lagUtfallstekst } from '../../utils/tekstformateringUtils';
import IkonMedTekst from '../ikon-med-tekst/IkonMedTekst';
import { UtfallIkon } from '../utfallikon/UtfallIkon';
import { useHentTiltaksdeltagelse } from '../../hooks/vilkår/useHentTiltaksdeltagelse';

const Tiltaksdeltagelse = () => {
  const { behandlingId } = useContext(BehandlingContext);
  const { tiltaksdeltagelse, isLoading, error } =
    useHentTiltaksdeltagelse(behandlingId);

  if (isLoading || !tiltaksdeltagelse) {
    return <Loader />;
  } else if (error)
    return (
      <Varsel
        variant="error"
        melding={`Kunne ikke introduksjonsprogramvilkår (${error.status} ${error.info})`}
      />
    );

  const { status, tiltakNavn, kilde } =
    tiltaksdeltagelse.registerSaksopplysning;

  return (
    <VStack gap="4">
      <VilkårHeader
        headertekst={'Tiltaksdeltagelse'}
        lovdatatekst={tiltaksdeltagelse.vilkårLovreferanse.beskrivelse}
        lovdatalenke={'https://lovdata.no/forskrift/2013-11-04-1286/§2'}
        paragraf={tiltaksdeltagelse.vilkårLovreferanse.paragraf}
      />

      <IkonMedTekst
        iconRenderer={() => (
          <UtfallIkon utfall={tiltaksdeltagelse.samletUtfall} />
        )}
        text={lagUtfallstekst(tiltaksdeltagelse.samletUtfall)}
      />
      <VilkårKort
        key={tiltakNavn}
        saksopplysningsperiode={tiltaksdeltagelse.utfallperiode}
        kilde={kilde}
        utfall={tiltaksdeltagelse.samletUtfall}
        grunnlag={[
          { header: 'Type tiltak', data: tiltakNavn },
          { header: 'Siste status', data: status },
        ]}
      />
    </VStack>
  );
};

export default Tiltaksdeltagelse;
