import React from 'react';
import VilkårsvurderingAvStønadsdagerHeading from '../tiltak/vilkårsvurdering-av-stønadsdager/VilkårsvurderingAvStønadsdagerHeading';
import { Heading, Loader, VStack } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';

const VilkårsvurderingAvStønadsdager = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  return (
    <div>
      <VilkårsvurderingAvStønadsdagerHeading />
      <VStack gap="4">
        <Heading size={'small'} style={{ marginTop: '1rem' }}>
          Hvor mange dager skal bruker delta på tiltak?
        </Heading>
      </VStack>
    </div>
  );
};

export default VilkårsvurderingAvStønadsdager;
