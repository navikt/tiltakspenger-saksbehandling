import { Table } from '@navikt/ds-react';
import { PropsWithChildren } from 'react';

const Behandlingsoversikt = ({ children }: PropsWithChildren) => {
  return (
    <Table zebraStripes>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell scope="col">Fødselsnummer</Table.HeaderCell>
          <Table.HeaderCell scope="col">Type</Table.HeaderCell>
          <Table.HeaderCell scope="col">Kravtidspunkt</Table.HeaderCell>
          <Table.HeaderCell scope="col">Status</Table.HeaderCell>
          <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
          <Table.HeaderCell scope="col">Saksbehandler</Table.HeaderCell>
          <Table.HeaderCell scope="col">Beslutter</Table.HeaderCell>
          <Table.HeaderCell scope="col">Handlinger</Table.HeaderCell>
          <Table.HeaderCell scope="col"></Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>{children}</Table.Body>
    </Table>
  );
};

export default Behandlingsoversikt;
