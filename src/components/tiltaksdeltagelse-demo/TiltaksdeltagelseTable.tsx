import React from 'react';
import { Table } from '@navikt/ds-react';
import { formatPeriode } from '../../utils/date';
import { Tiltaksdeltagelse } from './types';

interface TiltaksdeltagelseTableProps {
  deltagelser: Tiltaksdeltagelse[];
}

const TiltaksdeltagelseTable = ({
  deltagelser,
}: TiltaksdeltagelseTableProps) => {
  return (
    <Table size="small">
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
          <Table.HeaderCell scope="col">Antall dager per uke</Table.HeaderCell>
          <Table.HeaderCell scope="col">Status</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {deltagelser.map(({ periode, antallDagerIUken, status }) => {
          const formattertPeriode = formatPeriode(periode);
          return (
            <Table.Row key={formattertPeriode}>
              <Table.DataCell>{formattertPeriode}</Table.DataCell>
              <Table.DataCell>{antallDagerIUken}</Table.DataCell>
              <Table.DataCell>{status}</Table.DataCell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};

export default TiltaksdeltagelseTable;
