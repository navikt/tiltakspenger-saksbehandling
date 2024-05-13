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
import { TiltaksdeltagelseDTO } from './types';
import TiltaksdeltagelseTable from './TiltaksdeltagelseTable';
import { PencilIcon } from '@navikt/aksel-icons';
import styles from './TiltaksdeltagelseDemo.module.css';
import TiltaksdeltagelseForm from './TiltaksdeltagelseForm';

interface StønadsdagerVilkårsvurderingProps {
  tiltaksdeltagelser: TiltaksdeltagelseDTO[];
}

const StønadsdagerVilkårsvurdering = ({
  tiltaksdeltagelser,
}: StønadsdagerVilkårsvurderingProps) => {
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
          {tiltaksdeltagelser.map(
            ({
              tiltaksvariant,
              antallDager,
              periode,
              kilde,
              deltagelsesperioder,
            }) => {
              return (
                <div key={formatPeriode(periode)}>
                  <Box
                    background="surface-subtle"
                    padding="2"
                    style={{ position: 'relative' }}
                  >
                    <BodyShort size="medium" spacing>
                      <b>Tiltaksvariant:</b> {tiltaksvariant}
                    </BodyShort>
                    <BodyShort size="medium" spacing>
                      <b>Tiltaksperiode:</b> {formatPeriode(periode)}
                    </BodyShort>
                    <BodyShort size="medium" spacing>
                      <b>Antall dager registrert på tiltaket:</b> {antallDager}
                    </BodyShort>
                    <BodyShort size="medium" spacing>
                      <b>Kilde:</b> {kilde}
                    </BodyShort>
                    <TiltaksdeltagelseTable
                      deltagelsesperioder={deltagelsesperioder}
                    />
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

export default StønadsdagerVilkårsvurdering;
