import { RegistrertTiltak } from '../../types/Søknad';
import React from 'react';
import styles from './VilkårsvurderingAvStønadsdager.module.css';
import VilkårsvurderingAvStønadsdagerHeading from './VilkårsvurderingAvStønadsdagerHeading';
import TiltakMedAntallDager from './TiltakMedAntallDager';
import { Heading, Loader, VStack } from '@navikt/ds-react';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import { useRouter } from 'next/router';

function renderTiltakMedAntallDager(tiltak: RegistrertTiltak) {
  return <TiltakMedAntallDager tiltak={tiltak} key={tiltak.arrangør} />;
}

const VilkårsvurderingAvStønadsdager = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <VilkårsvurderingAvStønadsdagerHeading />
      <VStack gap="4">
        <Heading size={'small'} style={{ marginTop: '1rem' }}>
          Hvor mange dager skal bruker delta på tiltak?
        </Heading>
        {valgtBehandling.registrerteTiltak.map(renderTiltakMedAntallDager)}
      </VStack>
    </div>
  );
};

export default VilkårsvurderingAvStønadsdager;
