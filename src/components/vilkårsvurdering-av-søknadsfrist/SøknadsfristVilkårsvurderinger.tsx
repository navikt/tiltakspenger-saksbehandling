import React, { useRef } from 'react';
import { Button, Table } from '@navikt/ds-react';
import { formatDate, formatPeriode } from '../../utils/date';
import { Utfall } from '../../types/Utfall';
import { Vurdering } from '../../types/Vurdering';
import { UtfallIkon } from '../utfall-ikon/UtfallIkon';
import styles from './SøknadsfristVilkårsvurderinger.module.css';

interface SøknadsfristVilkårsvurderingerProps {
  vurderinger: Vurdering[];
  kravdato: Date;
  kravdatoKilde: string;
}

interface SøknadsfristVurderingRadProps {
  vurdering: Vurdering;
  kravdato: Date;
  kravdatoKilde: string;
}

const SøknadsfristVurderingRad = ({
  vurdering: { utfall, periode },
  kravdatoKilde,
  kravdato,
}: SøknadsfristVurderingRadProps) => {
  const formattertPeriode = formatPeriode(periode);
  return (
    <Table.Row
      className={styles.søknadsfristVurderingRad}
      key={formattertPeriode}
    >
      <Table.DataCell>{formattertPeriode}</Table.DataCell>
      <Table.DataCell>{formatDate(kravdato.toDateString())}</Table.DataCell>
      <Table.DataCell>{kravdatoKilde}</Table.DataCell>
      <Table.DataCell>
        {utfall === Utfall.OPPFYLT ? 'Ja' : 'Nei'}
      </Table.DataCell>
      <div className={styles.søknadsfristVurderingRad__utfallIkon}>
        <UtfallIkon utfall={utfall} />
      </div>
    </Table.Row>
  );
};

const SøknadsfristVilkårsvurderinger = ({
  vurderinger,
  kravdato,
  kravdatoKilde,
}: SøknadsfristVilkårsvurderingerProps) => {
  const ref = useRef(null);
  return (
    <div className={styles.søknadsfristVilkårsvurderinger__container}>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Periode</Table.HeaderCell>
            <Table.HeaderCell>Kravdato</Table.HeaderCell>
            <Table.HeaderCell>Kilde</Table.HeaderCell>
            <Table.HeaderCell>Gir rett på tiltakspenger</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {vurderinger.map((vurdering) => (
            <SøknadsfristVurderingRad
              vurdering={vurdering}
              kravdato={kravdato}
              kravdatoKilde={kravdatoKilde}
              key={formatPeriode(vurdering.periode)}
            />
          ))}
        </Table.Body>
      </Table>
      <Button
        className={styles.søknadsfristVilkårsvurderinger__endreKnapp}
        variant="secondary"
        type="button"
        size="small"
        onClick={() => (ref as any).current?.showModal()}
      >
        Endre kravdato
      </Button>
    </div>
  );
};

export default SøknadsfristVilkårsvurderinger;
