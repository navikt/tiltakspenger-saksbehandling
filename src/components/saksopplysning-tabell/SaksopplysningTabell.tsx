import { Table } from '@navikt/ds-react';
import React from 'react';
import { SaksopplysningInnDTO } from '../../types/Behandling';
import { Saksopplysning } from './Saksopplysning';
import { Lesevisning } from '../../utils/avklarLesevisning';
import { Periode } from '../../types/Periode';

interface SaksopplysningProps {
  saksopplysninger: SaksopplysningInnDTO[];
  behandlingId: string;
  vurderingsperiode: Periode;
  lesevisning: Lesevisning;
}

export const SaksopplysningTabell = ({
  saksopplysninger,
  behandlingId,
  vurderingsperiode,
  lesevisning,
}: SaksopplysningProps) => {
  return (
    <>
      <Table size="small" style={{ tableLayout: 'fixed', width: '100%' }}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader style={{ width: '5%' }} />
            <Table.ColumnHeader style={{ width: '25%' }}>
              Ytelse
            </Table.ColumnHeader>
            <Table.ColumnHeader>Fakta</Table.ColumnHeader>
            <Table.ColumnHeader>Periode</Table.ColumnHeader>
            <Table.ColumnHeader style={{ width: '10%' }}>
              Kilde
            </Table.ColumnHeader>
            <Table.ColumnHeader>Detaljer</Table.ColumnHeader>
            <Table.ColumnHeader style={{ width: '10%' }}>
              Lovdata
            </Table.ColumnHeader>
            <Table.ColumnHeader style={{ width: '5%' }} />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {saksopplysninger.map((saksopplysning) => (
            <Saksopplysning
              key={saksopplysning.saksopplysning}
              saksopplysningDTO={saksopplysning}
              behandlingId={behandlingId}
              vurderingsperiode={vurderingsperiode}
              lesevisning={lesevisning}
            />
          ))}
        </Table.Body>
      </Table>
    </>
  );
};
