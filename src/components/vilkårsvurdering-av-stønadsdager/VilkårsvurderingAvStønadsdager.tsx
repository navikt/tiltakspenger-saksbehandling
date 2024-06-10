import { RegistrertTiltak } from '../../types/Søknad';
import React from 'react';
import styles from './VilkårsvurderingAvStønadsdager.module.css';
import VilkårsvurderingAvStønadsdagerHeading from './VilkårsvurderingAvStønadsdagerHeading';
import TiltakMedAntallDager from './TiltakMedAntallDager';
import { Heading, VStack } from '@navikt/ds-react';

interface VilkårsvurderingAvStønadsdagerProps {
  tiltak: RegistrertTiltak[];
}

function renderTiltakMedAntallDager(tiltak: RegistrertTiltak) {
  return <TiltakMedAntallDager tiltak={tiltak} key={tiltak.arrangør} />;
}

const VilkårsvurderingAvStønadsdager = ({
  tiltak,
}: VilkårsvurderingAvStønadsdagerProps) => {
  return (
    <div className={styles.container}>
      <VilkårsvurderingAvStønadsdagerHeading />
      <VStack gap="4">
        <Heading size={'small'} style={{ marginTop: '1rem' }}>
          Hvor mange dager skal bruker delta på tiltak?
        </Heading>
        {tiltak.map(renderTiltakMedAntallDager)}
      </VStack>
    </div>
  );
};

export default VilkårsvurderingAvStønadsdager;
