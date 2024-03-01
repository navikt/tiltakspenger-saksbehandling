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
  const {meldekortBeregning } = useHentMeldekortBeregning(meldekort.id)

  return (
    <Table size="small" style={{backgroundColor: 'rgba(247, 247, 247, 1)'}}>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader style={{ width: '50%' }} scope="col">
            Beregning
          </Table.ColumnHeader>
          <Table.ColumnHeader style={{ width: '10%' }} scope="col">
            Dager
          </Table.ColumnHeader>
          <Table.ColumnHeader style={{ width: '40%' }} scope="col" align="right">
            Beløp
          </Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
          <Table.Row style={{ borderBottom: 'none' }}>
            <Table.DataCell>
              {velgIkon(MeldekortStatus.Deltatt)} Deltatt i tiltak
            </Table.DataCell>
            <Table.DataCell>{meldekortBeregning?.antallDeltatt}</Table.DataCell>
            <Table.DataCell></Table.DataCell>
          </Table.Row>
        <Table.Row style={{ borderBottom: 'none' }}>
          <Table.DataCell>
            {velgIkon(MeldekortStatus.IkkeDeltatt)} Ikke deltatt i tiltaket
          </Table.DataCell>
          <Table.DataCell>{meldekortBeregning?.antallIkkeDeltatt}</Table.DataCell>
          <Table.DataCell></Table.DataCell>
        </Table.Row>
        <Table.Row style={{ borderBottom: 'none' }}>
          <Table.DataCell>
            {velgIkon(MeldekortStatus.FraværSyk)} Fravær - Syk
          </Table.DataCell>
          <Table.DataCell>{meldekortBeregning?.antallSykDager}</Table.DataCell>
          <Table.DataCell></Table.DataCell>
        </Table.Row>
        <Table.Row style={{ borderBottom: 'none' }}>
          <Table.DataCell>
            {velgIkon(MeldekortStatus.FraværSyktBarn)} Fravær - Sykt barn
          </Table.DataCell>
          <Table.DataCell>{meldekortBeregning?.antallSykBarnDager}</Table.DataCell>
          <Table.DataCell></Table.DataCell>
        </Table.Row>
        <Table.Row style={{ borderBottom: 'none' }}>
          <Table.DataCell>
            {velgIkon(MeldekortStatus.FraværVelferd)} Fravær - Velferd
          </Table.DataCell>
          <Table.DataCell>{meldekortBeregning?.antallVelferd}</Table.DataCell>
          <Table.DataCell></Table.DataCell>
        </Table.Row>
        <Table.Row>
          <Table.DataCell>Antall dager med 75% utbetaling</Table.DataCell>
          <Table.DataCell> {meldekortBeregning?.antallDelvisUtbetaling}</Table.DataCell>
          <Table.DataCell align="right">
            <BodyShort> {meldekortBeregning?.sumDelvis} ,- </BodyShort>
          </Table.DataCell>
        </Table.Row>
        <Table.Row>
          <Table.DataCell>Antall dager med 100% utbetaling</Table.DataCell>
          <Table.DataCell> {meldekortBeregning?.antallFullUtbetaling}</Table.DataCell>
          <Table.DataCell align="right">
            <BodyShort> {meldekortBeregning?.sumFull} ,- </BodyShort>
          </Table.DataCell>
        </Table.Row>
        <Table.Row>
          <Table.DataCell>Beløp til utbetaling</Table.DataCell>
          <Table.DataCell />
          <Table.DataCell align="right">
            <BodyShort> {meldekortBeregning?.sumTotal} ,- </BodyShort>
          </Table.DataCell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};
