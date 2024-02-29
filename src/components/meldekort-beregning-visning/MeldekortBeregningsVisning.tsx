import {BodyShort, Table} from '@navikt/ds-react';
import {Meldekort, MeldekortStatus,} from '../../types/MeldekortTypes';
import {velgIkon} from '../meldekort-side/MeldekortUke';
import {useHentMeldekortBeregning} from "../../hooks/useHentMeldekortBeregning";

interface MeldekortBeregningsvisningProps {
  meldekort: Meldekort;
}

export const MeldekortBeregningsvisning = ({
  meldekort,
}: MeldekortBeregningsvisningProps) => {
  const meldekortBeregningData = useHentMeldekortBeregning(meldekort.id)

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
          <Table.Row style={{ borderBottom: 'none' }}>
            <Table.DataCell>
              {velgIkon(MeldekortStatus.Deltatt)} Deltatt i tiltak
            </Table.DataCell>
            <Table.DataCell>{meldekortBeregningData.meldekortBeregning?.antallDeltatt}</Table.DataCell>
            <Table.DataCell></Table.DataCell>
          </Table.Row>
        <Table.Row style={{ borderBottom: 'none' }}>
          <Table.DataCell>
            {velgIkon(MeldekortStatus.IkkeDeltatt)} Ikke deltatt i tiltaket
          </Table.DataCell>
          <Table.DataCell>{meldekortBeregningData.meldekortBeregning?.antallIkkeDeltatt}</Table.DataCell>
          <Table.DataCell></Table.DataCell>
        </Table.Row>
        <Table.Row style={{ borderBottom: 'none' }}>
          <Table.DataCell>
            {velgIkon(MeldekortStatus.FraværSyk)} Fravær - Syk
          </Table.DataCell>
          <Table.DataCell>{meldekortBeregningData.meldekortBeregning?.antallSykDager}</Table.DataCell>
          <Table.DataCell></Table.DataCell>
        </Table.Row>
        <Table.Row style={{ borderBottom: 'none' }}>
          <Table.DataCell>
            {velgIkon(MeldekortStatus.FraværSyktBarn)} Fravær - Sykt barn
          </Table.DataCell>
          <Table.DataCell>{meldekortBeregningData.meldekortBeregning?.antallSykBarnDager}</Table.DataCell>
          <Table.DataCell></Table.DataCell>
        </Table.Row>
        <Table.Row style={{ borderBottom: 'none' }}>
          <Table.DataCell>
            {velgIkon(MeldekortStatus.FraværVelferd)} Fravær - Velferd
          </Table.DataCell>
          <Table.DataCell>{meldekortBeregningData.meldekortBeregning?.antallVelferd}</Table.DataCell>
          <Table.DataCell></Table.DataCell>
        </Table.Row>
        <Table.Row>
          <Table.DataCell>Antall dager med 75% utbetaling</Table.DataCell>
          <Table.DataCell> {meldekortBeregningData.meldekortBeregning?.antallDelvisUtbetaling}</Table.DataCell>
          <Table.DataCell align="right">
            <BodyShort>
              {meldekortBeregningData.meldekortBeregning?.sumDelvis}
              ,-
            </BodyShort>
          </Table.DataCell>
        </Table.Row>
        <Table.Row>
          <Table.DataCell>Antall dager med 100% utbetaling</Table.DataCell>
          <Table.DataCell> {meldekortBeregningData.meldekortBeregning?.antallFullUtbetaling}</Table.DataCell>
          <Table.DataCell align="right">
            <BodyShort>
              {meldekortBeregningData.meldekortBeregning?.sumFull}
              ,-
            </BodyShort>
          </Table.DataCell>
        </Table.Row>
        <Table.Row>
          <Table.DataCell>Beløp til utbetaling</Table.DataCell>
          <Table.DataCell />
          <Table.DataCell align="right">
            <BodyShort>
              {meldekortBeregningData.meldekortBeregning?.sumTotal}
              ,-
            </BodyShort>
          </Table.DataCell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};
