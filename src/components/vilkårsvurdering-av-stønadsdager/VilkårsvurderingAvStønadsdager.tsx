import React from 'react';
import { BodyShort, Box, Button } from '@navikt/ds-react';
import { formatPeriode } from '../../utils/date';
import TiltaksdeltagelseTable from '../tiltaksdeltagelse-table/TiltaksdeltagelseTable';
import { PencilIcon } from '@navikt/aksel-icons';
import TiltaksdeltagelseForm from '../tiltaksdeltagelse-form/TiltaksdeltagelseForm';
import { RegistrertTiltak } from '../../types/Søknad';
import styles from './VilkårsvurderingAvStønadsdager.module.css';
import dayjs from 'dayjs';

interface VilkårsvurderingAvStønadsdagerProps {
  registrertTiltak: RegistrertTiltak;
}

const VilkårsvurderingAvStønadsdager = ({
  registrertTiltak,
}: VilkårsvurderingAvStønadsdagerProps) => {
  const [editMode, setEditMode] = React.useState(false);
  const { periode, navn, arrangør, dagerIUken, kilde } = registrertTiltak;
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
              minDate={dayjs(periode.fra).toDate()}
              maxDate={dayjs(periode.til).toDate()}
            />
          </div>
        )}
      </Box>
    </div>
  );
};

export default VilkårsvurderingAvStønadsdager;
