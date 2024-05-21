import React from 'react';
import { CheckmarkCircleFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, ExpansionCard, HStack, Link } from '@navikt/ds-react';
import { Utfall } from '../../types/Utfall';
import { formatPeriode } from '../../utils/date';
import { RegistrertTiltak } from '../../types/Søknad';

interface VilkårsvurderingAvTiltaksdeltagelseProps {
  samletUtfall: Utfall;
  registrerteTiltak: RegistrertTiltak[];
}

const VilkårsvurderingAvTiltaksdeltagelse = ({
  samletUtfall,
  registrerteTiltak,
}: VilkårsvurderingAvTiltaksdeltagelseProps) => {
  return (
    <ExpansionCard aria-label="Vilkårsvurdering av tiltaksdeltagelse">
      <ExpansionCard.Header>
        <HStack wrap={false} gap="4" align="center">
          <div>
            {samletUtfall === Utfall.OPPFYLT && (
              <CheckmarkCircleFillIcon
                aria-hidden
                fontSize="3rem"
                color="green"
              />
            )}
          </div>
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
        {registrerteTiltak.map(
          ({
            periode,
            status,
            arrangør,
            navn,
            harSøkt,
            girRett,
            kilde,
            deltagelseUtfall,
            begrunnelse,
          }) => {
            return (
              <Box
                background="surface-subtle"
                padding="2"
                key={arrangør}
                style={{ marginTop: '1rem' }}
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
                <BodyShort size="medium" spacing>
                  <b>Vilkår oppfylt:</b> {deltagelseUtfall}
                </BodyShort>
                <BodyShort size="medium">
                  <b>Begrunnelse:</b> {begrunnelse}
                </BodyShort>
              </Box>
            );
          },
        )}
      </ExpansionCard.Content>
    </ExpansionCard>
  );
};

export default VilkårsvurderingAvTiltaksdeltagelse;
