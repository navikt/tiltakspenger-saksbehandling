import React from 'react';
import { Heading, Link, VStack } from '@navikt/ds-react';

const VilkårsvurderingAvStønadsdagerHeading = () => (
  <VStack gap="1">
    <Heading size={'medium'}>Tiltaksdager</Heading>
    <Link
      href="https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286"
      target="_blank"
    >
      Tiltakspengeforskriften § 6-1 Stønadsdager
    </Link>
  </VStack>
);

export default VilkårsvurderingAvStønadsdagerHeading;
