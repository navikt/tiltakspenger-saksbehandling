import React from 'react';
import {
  BodyShort,
  Box,
  Button,
  ExpansionCard,
  HStack,
  Link,
} from '@navikt/ds-react';
import { formatPeriode } from '../../utils/date';
import TiltaksdeltagelseTable from '../tiltaksdeltagelse-table/TiltaksdeltagelseTable';
import { PencilIcon } from '@navikt/aksel-icons';
import TiltaksdeltagelseForm from '../tiltaksdeltagelse-form/TiltaksdeltagelseForm';
import { RegistrertTiltak } from '../../types/Søknad';
import styles from './VilkårsvurderingAvStønadsdager.module.css';

interface VilkårsvurderingAvStønadsdagerProps {
  registrerteTiltak: RegistrertTiltak[];
}

const VilkårsvurderingAvStønadsdager = ({
  registrerteTiltak,
}: VilkårsvurderingAvStønadsdagerProps) => {
  const [editMode, setEditMode] = React.useState(false);
  return (
    <div className={styles.container}>
      <ExpansionCard aria-label="Stønadsdager">
        <ExpansionCard.Header>
          <HStack wrap={false} gap="4" align="center">
            <div>
              <ExpansionCard.Title>Stønadsdager</ExpansionCard.Title>
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
            ({ navn, dagerIUken, arrangør, periode, kilde }) => {
              return (
                <div key={formatPeriode(periode)} style={{ marginTop: '1rem' }}>
                  <Box
                    background="surface-subtle"
                    padding="2"
                    style={{ position: 'relative' }}
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
                      <b>Antall dager registrert på tiltaket:</b> {dagerIUken}
                    </BodyShort>
                    <BodyShort size="medium" spacing>
                      <b>Kilde:</b> {kilde}
                    </BodyShort>
                    {
                      <TiltaksdeltagelseTable
                        deltagelsesperioder={[
                          {
                            periode: periode,
                            antallDager: dagerIUken,
                            status: 'test',
                          },
                        ]}
                      />
                    }
                    <div style={{ position: 'absolute', right: 0, top: 0 }}>
                      <Button
                        icon={<PencilIcon title="Rediger" />}
                        variant={'tertiary'}
                        className={styles.tiltakCard__iconButton}
                        type="button"
                        onClick={() => setEditMode(!editMode)}
                      >
                        Rediger
                      </Button>
                    </div>
                    {editMode && (
                      <div className={styles.tiltakCard__form}>
                        <TiltaksdeltagelseForm
                          onSubmit={() => {
                            setEditMode(false);
                          }}
                          onCancel={() => {
                            setEditMode(false);
                          }}
                        />
                      </div>
                    )}
                  </Box>
                </div>
              );
            },
          )}
        </ExpansionCard.Content>
      </ExpansionCard>
    </div>
  );
};

export default VilkårsvurderingAvStønadsdager;
