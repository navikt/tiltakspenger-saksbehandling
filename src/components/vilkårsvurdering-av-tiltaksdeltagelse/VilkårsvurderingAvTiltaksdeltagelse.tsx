import React from 'react';
import {
  BodyShort,
  ExpansionCard,
  HStack,
  Link,
  VStack,
} from '@navikt/ds-react';
import { formatPeriode } from '../../utils/date';
import { RegistrertTiltak } from '../../types/Søknad';
import styles from './VilkårsvurderingAvTiltaksdeltagelse.module.css';
import { UtfallIkon } from '../utfall-ikon/UtfallIkon';

interface VilkårsvurderingAvTiltaksdeltagelseProps {
  registrerteTiltak: RegistrertTiltak[];
}

const VilkårsvurderingAvTiltaksdeltagelse = ({
  registrerteTiltak,
}: VilkårsvurderingAvTiltaksdeltagelseProps) => {
  return (
    <ExpansionCard aria-label="Vilkårsvurdering av tiltaksdeltagelse">
      <ExpansionCard.Header>
        <HStack wrap={false} gap="4" align="center">
          <div>
            <ExpansionCard.Title>Tiltaksdeltagelse</ExpansionCard.Title>
            <ExpansionCard.Description>
              <Link
                href="https://lovdata.no/dokument/SF/forskrift/2013-11-04-1286"
                target="_blank"
              >
                Tiltakspengeforskriften § 6-1 Stønadsdager
              </Link>
            </ExpansionCard.Description>
          </div>
        </HStack>
      </ExpansionCard.Header>
      <ExpansionCard.Content>
        <VStack gap="4">
          {registrerteTiltak.map(
            (
              {
                periode,
                status,
                arrangør,
                navn,
                harSøkt,
                girRett,
                kilde,
                deltagelseUtfall,
                begrunnelse,
              },
              index,
            ) => {
              return (
                <HStack
                  gap="4"
                  key={formatPeriode(periode) + index}
                  className={styles.tiltaksdeltagelse}
                >
                  <UtfallIkon utfall={deltagelseUtfall} />
                  <VStack gap="1">
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
                      <b>Gir rett til tiltakspenger:</b>{' '}
                      {girRett ? 'Ja' : 'Nei'}
                    </BodyShort>
                    <BodyShort size="medium" spacing>
                      <b>Kilde:</b> {kilde}
                    </BodyShort>
                    <BodyShort size="medium" spacing>
                      <b>Vilkår oppfylt:</b> {deltagelseUtfall}
                    </BodyShort>
                    <BodyShort size="medium">
                      <b>Begrunnelse:</b> {begrunnelse}
                    </BodyShort>
                  </VStack>
                </HStack>
              );
            },
          )}
        </VStack>
      </ExpansionCard.Content>
    </ExpansionCard>
  );
};

export default VilkårsvurderingAvTiltaksdeltagelse;
