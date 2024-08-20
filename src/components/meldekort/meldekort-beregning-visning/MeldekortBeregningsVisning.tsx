import { BodyShort, Table } from '@navikt/ds-react';
import { velgIkonForMeldekortStatus } from '../meldekortside/MeldekortUke';
import router from 'next/router';
import { useHentMeldekortBeregning } from '../../../hooks/meldekort/useHentMeldekortBeregning';
import Varsel from '../../varsel/Varsel';
import { MeldekortStatus, meldekortStatusTilTekst } from '../../../utils/meldekortStatus';

// TODO Kew: Man skal muligens ikke beregne på samme måte som før etter John har vært på fære..!
// Avventer derfor å fikse denne
export const MeldekortBeregningsvisning = () => {
  const meldekortId = router.query.meldekortId as string;
  const { meldekortBeregning, error } = useHentMeldekortBeregning(meldekortId);

  if (error)
    return (
      <Varsel
        variant="error"
        melding={`Kunne ikke beregne meldekort (${error.status} ${error.info})`}
      />
    );

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader style={{ width: '50%' }} scope="col">
            Beregning
          </Table.ColumnHeader>
          <Table.ColumnHeader style={{ width: '10%' }} scope="col">
            Dager
          </Table.ColumnHeader>
          <Table.ColumnHeader
            style={{ width: '40%' }}
            scope="col"
            align="right"
          >
            Beløp
          </Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Beregning meldekortStatus={MeldekortStatus.IkkeDeltatt} antall={meldekortBeregning?.antallIkkeDeltatt} />
        <Beregning meldekortStatus={MeldekortStatus.FraværSyk} antall={meldekortBeregning?.antallSykDager} />
        <Beregning meldekortStatus={MeldekortStatus.FraværSyktBarn} antall={meldekortBeregning?.antallSykBarnDager} />
        <Beregning meldekortStatus={MeldekortStatus.DeltattUtenLønnITiltaket} antall={meldekortBeregning?.antallDeltatt} />

        vvvv (Disse må ordnes på)
        <Beregning meldekortStatus={MeldekortStatus.DeltattMedLønnITiltaket} antall={-1} />
        <Beregning meldekortStatus={MeldekortStatus.FraværVelferdGodkjentAvNav} antall={-1} />
        <Beregning meldekortStatus={MeldekortStatus.FraværVelferdIkkeGodkjentAvNav} antall={-1} />
        ^^^^
        <Table.Row>
          <Table.DataCell>Antall dager med 75% utbetaling</Table.DataCell>
          <Table.DataCell>
            {' '}
            {meldekortBeregning?.antallDelvisUtbetaling}
          </Table.DataCell>
          <Table.DataCell align="right">
            <BodyShort> {meldekortBeregning?.sumDelvis} ,- </BodyShort>
          </Table.DataCell>
        </Table.Row>
        <Table.Row>
          <Table.DataCell>Antall dager med 100% utbetaling</Table.DataCell>
          <Table.DataCell>
            {' '}
            {meldekortBeregning?.antallFullUtbetaling}
          </Table.DataCell>
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

interface beregningProps {
  meldekortStatus: MeldekortStatus;
  antall: number;
}

const Beregning = ({ meldekortStatus, antall }: beregningProps) => {
  return (
    <Table.Row>
      <Table.DataCell>
        {velgIkonForMeldekortStatus(meldekortStatus)} {meldekortStatusTilTekst[meldekortStatus]}
      </Table.DataCell>
      <Table.DataCell>{antall}</Table.DataCell>
      <Table.DataCell></Table.DataCell>
    </Table.Row>
  )
}