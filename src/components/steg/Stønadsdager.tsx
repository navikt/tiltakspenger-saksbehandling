import React from 'react';
import VilkårsvurderingAvStønadsdagerHeading from '../tiltak/vilkårsvurdering-av-stønadsdager/VilkårsvurderingAvStønadsdagerHeading';
import { Heading, Loader, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import TiltakMedAntallDager from '../tiltak/vilkårsvurdering-av-stønadsdager/TiltakMedAntallDager';

const VilkårsvurderingAvStønadsdager = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  const stønadsDager = valgtBehandling.stønadsdager;

  return (
    <div>
      <VilkårsvurderingAvStønadsdagerHeading />
      <VStack gap="4">
        <Heading size={'small'} style={{ marginTop: '1rem' }}>
          Hvor mange dager skal bruker delta på tiltak?
        </Heading>
        {stønadsDager.map((stønadsdagerSaksopplysning) => (
          <TiltakMedAntallDager
            key={stønadsdagerSaksopplysning.tiltak}
            stønadsdagerSaksopplysning={stønadsdagerSaksopplysning}
          />
        ))}
      </VStack>
    </div>
  );
};

export default VilkårsvurderingAvStønadsdager;
