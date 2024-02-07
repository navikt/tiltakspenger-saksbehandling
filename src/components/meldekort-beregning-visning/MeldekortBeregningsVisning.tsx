import { BodyShort, Table } from '@navikt/ds-react';
import {
  Meldekort,
  MeldekortDag,
  MeldekortStatus,
  MeldekortStatusTekster,
} from '../../types/MeldekortTypes';
import { velgMeldekortdagStatus } from '../../utils/meldekort';
import { velgIkon } from '../meldekort-side/MeldekortUke';
import { useEffect, useState } from 'react';

interface MeldekortBeregningsvisningProps {
  meldekort: Meldekort;
}

export const MeldekortBeregningsvisning = ({
  meldekort,
}: MeldekortBeregningsvisningProps) => {
  const [antallDager100prosent, setAntallDager100prosent] = useState<number>(0);
  const [antallDager75prosent, setAntallDager75prosent] = useState<number>(0);
  const [sumAntallDager100prosent, setSumAntallDager100prosent] =
    useState<number>(0);
  const [sumAntallDager75prosent, setSumAntallDager75prosent] =
    useState<number>(0);
  const egenMeldingsdager = 3;
  const dagsats = 268;

  useEffect(() => {
    finnAntallDagerMedRiktigUtbetalingsprosent();
    beregnRiktigSum();
  });

  const finnAntallDager = (meldekortStatus: MeldekortStatus) => {
    return meldekort.meldekortDager.filter(
      (dag: MeldekortDag) => dag.status === meldekortStatus,
    ).length;
  };

  const [antallDagerIkkeDeltatt, setAntallDagerIkkeDeltatt] = useState<number>(
    meldekort.meldekortDager.filter(
      (dag: MeldekortDag) => dag.status === MeldekortStatus.IkkeDeltatt,
    ).length,
  );
  const [antallDagerDeltatt, setAntallDagerDeltatt] = useState<number>(
    meldekort.meldekortDager.filter(
      (dag: MeldekortDag) => dag.status === MeldekortStatus.Deltatt,
    ).length,
  );
  const [antallDagerSyk, setAntallDagerSyk] = useState<number>(
    meldekort.meldekortDager.filter(
      (dag: MeldekortDag) => dag.status === MeldekortStatus.FraværSyk,
    ).length,
  );
  const [antallDagerSyktBarn, setAntallDagerSyktBarn] = useState<number>(
    meldekort.meldekortDager.filter(
      (dag: MeldekortDag) => dag.status === MeldekortStatus.FraværSyktBarn,
    ).length,
  );
  const [antallDagerVelferd, setAntallDagerVelferd] = useState<number>(
    meldekort.meldekortDager.filter(
      (dag: MeldekortDag) => dag.status === MeldekortStatus.FraværVelferd,
    ).length,
  );

  const finnAntallDagerMedRiktigUtbetalingsprosent = () => {
    const sykedager = antallDagerSyk + antallDagerSyktBarn;
    if (sykedager > egenMeldingsdager) {
      setAntallDager100prosent(
        antallDagerDeltatt + egenMeldingsdager + antallDagerVelferd,
      );
      setAntallDager75prosent(sykedager - egenMeldingsdager);
    } else {
      setAntallDager75prosent(0);
      setAntallDager100prosent(
        sykedager + antallDagerDeltatt + antallDagerVelferd,
      );
    }
  };

  const beregnRiktigSum = () => {
    setSumAntallDager100prosent(antallDager100prosent * dagsats);
    setSumAntallDager75prosent(antallDager75prosent * dagsats * 0.75);
  };

  const tellinger = [
    antallDagerDeltatt,
    antallDagerIkkeDeltatt,
    antallDagerSyk,
    antallDagerSyktBarn,
    antallDagerVelferd,
    antallDager100prosent,
    antallDager75prosent,
  ];
  const sumAntallDager = [sumAntallDager75prosent, sumAntallDager100prosent];

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
          <Table.Row key={meldekortStatus} style={{ borderBottom: 'none' }}>
            <Table.DataCell>
              {velgIkon(velgMeldekortdagStatus(meldekortStatus))}
              {meldekortStatus}
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
