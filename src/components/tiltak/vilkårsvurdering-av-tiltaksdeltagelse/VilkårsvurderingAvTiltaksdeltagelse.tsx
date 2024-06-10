import React from 'react';
import {
  BodyShort,
  ExpansionCard,
  HStack,
  Heading,
  Link,
  Loader,
  VStack,
} from '@navikt/ds-react';
import router from 'next/router';
import { useHentBehandling } from '../../../hooks/useHentBehandling';
import { UtfallIkon } from '../../utfall-ikon/UtfallIkon';
import { formatPeriode } from '../../../utils/date';

const VilkårsvurderingAvTiltaksdeltagelse = () => {
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  return (
    <>
      <HStack wrap={false} gap="4" align="center">
        <HStack gap="3" align="center" style={{ marginBottom: '0.5em' }}>
          <UtfallIkon
            utfall={valgtBehandling.registrerteTiltak[0].deltagelseUtfall}
          />
          <Heading size="medium" level="3">
            Tiltaksdeltagelse
          </Heading>
        </HStack>
      </HStack>
      <Link
        href="https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286"
        target="_blank"
        style={{ marginBottom: '1em' }}
      >
        Tiltakspengeforskriften § 6 Stønadsdager
      </Link>
      <VStack gap="4">
        {valgtBehandling.registrerteTiltak.map(
          ({ periode, status, arrangør, navn, harSøkt, girRett, kilde }, i) => {
            return (
              <VStack
                gap="1"
                style={{
                  border: '3px #005B82 solid',
                  borderRadius: '4px',
                  padding: '1em',
                }}
                key={arrangør + i}
              >
                <BodyShort size="medium" spacing>
                  <b>Tiltaksvariant:</b> {navn}
                </BodyShort>
                <BodyShort size="medium" spacing>
                  <b>Arrangør:</b> {arrangør}
                </BodyShort>
                <BodyShort size="medium" spacing>
                  <b>Tiltaksperiode:</b> {formatPeriode(periode)}
                </BodyShort>
                <BodyShort size="medium" spacing>
                  <b>Status:</b> {status}
                </BodyShort>
                <BodyShort size="medium" spacing>
                  <b>Søkt om tiltakspenger:</b> {harSøkt ? 'Ja' : 'Nei'}
                </BodyShort>
                <BodyShort size="medium" spacing>
                  <b>Gir rett til tiltakspenger:</b> {girRett ? 'Ja' : 'Nei'}
                </BodyShort>
                <BodyShort size="medium" spacing>
                  <b>Kilde:</b> {kilde}
                </BodyShort>
              </VStack>
            );
          },
        )}
      </VStack>
    </>
  );
};

export default VilkårsvurderingAvTiltaksdeltagelse;
