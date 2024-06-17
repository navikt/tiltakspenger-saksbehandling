import React, { useRef } from 'react';
import { Button, Table } from '@navikt/ds-react';
import { formatDate, formatPeriode, toDate } from '../../utils/date';
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
  const formattertPeriode = formatPeriode(periode);
  return (
    <Table.Row
      className={
        styles.vilkårsvurderingerAvFristForFramsettingAvKravVurderingRad
      }
      key={formattertPeriode}
    >
      <Table.DataCell>{formattertPeriode}</Table.DataCell>
      <Table.DataCell>{formatDate(kravdato.toDateString())}</Table.DataCell>
      <Table.DataCell>
        {utfall === Utfall.OPPFYLT ? 'Ja' : 'Nei'}
      </Table.DataCell>
      <div
        className={
          styles.vilkårsvurderingerAvFristForFramsettingAvKravVurderingRad__utfallIkon
        }
      >
        <UtfallIkon utfall={utfall} />
      </div>
    </Table.Row>
  );
};

const VilkårsvurderingerAvFristForFramsettingAvKrav = ({
  vurderinger,
  kravdatoSaksopplysning: { verdi, kilde },
}: VilkårsvurderingerAvFristForFramsettingAvKravProps) => {
  const ref = useRef(null);
  const kravdato = React.useMemo(() => toDate(verdi), [verdi]);
  return (
    <div
      className={
        styles.vilkårsvurderingerAvFristForFramsettingAvKrav__container
      }
    >
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
              kravdato={kravdato}
              key={formatPeriode(vurdering.periode)}
            />
          ))}
        </Table.Body>
      </Table>
      <Button
        className={
          styles.vilkårsvurderingerAvFristForFramsettingAvKrav__endreKnapp
        }
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
