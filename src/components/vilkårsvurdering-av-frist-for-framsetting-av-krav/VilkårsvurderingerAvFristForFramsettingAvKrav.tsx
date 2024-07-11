import React, { useRef } from 'react';
import { Button, Table } from '@navikt/ds-react';
import {
  formaterDatotekst,
  periodeTilFormatertDatotekst,
  tekstTilDate,
} from '../../utils/date';
import { Utfall } from '../../types/Utfall';
import { Vurdering } from '../../types/Vurdering';
import { UtfallIkon } from '../utfall-ikon/UtfallIkon';
import { KravdatoSaksopplysning } from '../../types/Behandling';
import styles from './VilkårsvurderingerAvFristForFramsettingAvKrav.module.css';

interface VilkårsvurderingerAvFristForFramsettingAvKravProps {
  vurderinger: Vurdering[];
  kravdatoSaksopplysning: KravdatoSaksopplysning;
}

interface VilkårsvurderingAvFristForFramsettingAvKravRadProps {
  vurdering: Vurdering;
  kravdato: Date;
}

const VilkårsvurderingAvFristForFramsettingAvKravRad = ({
  vurdering: { utfall, periode },
  kravdato,
}: VilkårsvurderingAvFristForFramsettingAvKravRadProps) => {
  const formattertPeriode = periodeTilFormatertDatotekst(periode);
  return (
    <Table.Row className={styles.vurderingRad} key={formattertPeriode}>
      <Table.DataCell>{formattertPeriode}</Table.DataCell>
      <Table.DataCell>
        {formaterDatotekst(kravdato.toDateString())}
      </Table.DataCell>
      <Table.DataCell>
        {utfall === Utfall.OPPFYLT ? 'Ja' : 'Nei'}
      </Table.DataCell>
      <div className={styles.vurderingRad__utfallIkon}>
        <UtfallIkon utfall={utfall} />
      </div>
    </Table.Row>
  );
};

const VilkårsvurderingerAvFristForFramsettingAvKrav = ({
  vurderinger,
  kravdatoSaksopplysning: { kravdato, kilde },
}: VilkårsvurderingerAvFristForFramsettingAvKravProps) => {
  const ref = useRef(null);
  const kravdatoopplysning = React.useMemo(
    () => tekstTilDate(kravdato),
    [kravdato],
  );
  return (
    <div className={styles.container}>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Periode</Table.HeaderCell>
            <Table.HeaderCell>Kravdato</Table.HeaderCell>
            <Table.HeaderCell>Vilkår oppfylt</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {vurderinger.map((vurdering) => (
            <VilkårsvurderingAvFristForFramsettingAvKravRad
              vurdering={vurdering}
              kravdato={kravdatoopplysning}
              key={periodeTilFormatertDatotekst(vurdering.periode)}
            />
          ))}
        </Table.Body>
      </Table>
      <Button
        className={styles.endreKnapp}
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

export default VilkårsvurderingerAvFristForFramsettingAvKrav;
