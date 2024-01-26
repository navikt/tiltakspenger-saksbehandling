import { BodyShort, Table } from '@navikt/ds-react';
import { MeldekortStatusTekster } from '../../types/MeldekortTypes';
import { velgMeldekortdagStatus } from '../../utils/meldekort';
import { velgIkon } from '../meldekort-side/MeldekortUke';

interface MeldekortBeregningsvisningProps {
  tellinger: number[];
  sumAntallDager: number[];
}

export const MeldekortBeregningsvisning = ({
  tellinger,
  sumAntallDager,
}: MeldekortBeregningsvisningProps) => {
  return (
    <Table size="small">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader style={{ width: '50%' }} scope="col">
            Beregning
          </Table.ColumnHeader>
          <Table.ColumnHeader
            style={{ width: '10%' }}
            scope="col"
          ></Table.ColumnHeader>
          <Table.ColumnHeader
            style={{ width: '40%' }}
            scope="col"
          ></Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {MeldekortStatusTekster.map((meldekortStatus, i) => (
          <Table.Row
            key={meldekortStatus.tekst}
            style={{ borderBottom: 'none' }}
          >
            <Table.DataCell>
              {velgIkon(velgMeldekortdagStatus(meldekortStatus.tekst))}
              {meldekortStatus.tekst}
            </Table.DataCell>
            <Table.DataCell>{tellinger[i]}</Table.DataCell>
            <Table.DataCell>{i > 3 && sumAntallDager[i]}</Table.DataCell>
          </Table.Row>
        ))}
        <Table.Row>
          <Table.HeaderCell>Antall dager med 75% utbetaling</Table.HeaderCell>
          <Table.DataCell>{tellinger[5]}</Table.DataCell>
          <Table.DataCell align="right">
            <BodyShort>
              {sumAntallDager[0].toString()}
              ,-
            </BodyShort>
          </Table.DataCell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell>Antall dager med 100% utbetaling</Table.HeaderCell>
          <Table.DataCell>{tellinger[6]}</Table.DataCell>
          <Table.DataCell align="right">
            <BodyShort>
              {sumAntallDager[1].toString()}
              ,-
            </BodyShort>
          </Table.DataCell>
        </Table.Row>
        <Table.Row>
          <Table.HeaderCell>Beløp til utbetaling</Table.HeaderCell>
          <Table.DataCell />
          <Table.DataCell align="right">
            <BodyShort>
              {(sumAntallDager[0] + sumAntallDager[1]).toString()}
              ,-
            </BodyShort>
          </Table.DataCell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};
