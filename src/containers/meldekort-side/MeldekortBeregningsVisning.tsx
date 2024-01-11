import {
  CheckmarkCircleFillIcon,
  ExclamationmarkTriangleFillIcon,
  XMarkOctagonFillIcon,
} from '@navikt/aksel-icons';
import { BodyShort, Table } from '@navikt/ds-react';

interface MeldekortBeregningsvisningProps {
  antallDagerIkkeDeltatt: number;
  antallDagerDeltatt: number;
  antallDagerSyk: number;
  antallDagerVelferd: number;
  antallDagerSyktBarn: number;
  antallDager100prosent: number;
  antallDager75prosent: number;
  sumAntallDager100prosent: number;
  sumAntallDager75prosent: number;
}

export const MeldekortBeregningsvisning = ({
  antallDagerIkkeDeltatt,
  antallDagerDeltatt,
  antallDagerSyk,
  antallDagerSyktBarn,
  antallDagerVelferd,
  antallDager100prosent,
  antallDager75prosent,
  sumAntallDager100prosent,
  sumAntallDager75prosent,
}: MeldekortBeregningsvisningProps) => {
  return (
    <Table style={{ tableLayout: 'fixed', width: '100%' }}>
      <Table.Row>
        <Table.HeaderCell style={{ width: '50%' }} scope="col">
          Beregning
        </Table.HeaderCell>
        <Table.HeaderCell
          style={{ width: '10%' }}
          scope="col"
        ></Table.HeaderCell>
        <Table.HeaderCell
          style={{ width: '40%' }}
          scope="col"
        ></Table.HeaderCell>
      </Table.Row>
      <Table.Row>
        <Table.DataCell>
          <BodyShort style={{ marginBottom: '0.5rem' }}>
            <>
              <CheckmarkCircleFillIcon
                style={{
                  color: 'green',
                  alignSelf: 'center',
                  marginRight: '0.5rem',
                }}
              />
              Deltatt i tiltak
            </>
          </BodyShort>
          <BodyShort style={{ marginBottom: '0.5rem' }}>
            <>
              <XMarkOctagonFillIcon
                style={{
                  color: 'red',
                  alignSelf: 'center',
                  marginRight: '0.5rem',
                }}
              />
              Ikke deltatt i tiltak
            </>
          </BodyShort>

          <BodyShort style={{ marginBottom: '0.5rem' }}>
            <>
              <ExclamationmarkTriangleFillIcon
                style={{
                  color: 'orange',
                  alignSelf: 'center',
                  marginRight: '0.5rem',
                }}
              />
              Fravær - Syk
            </>
          </BodyShort>

          <BodyShort style={{ marginBottom: '0.5rem' }}>
            <>
              <ExclamationmarkTriangleFillIcon
                style={{
                  color: 'orange',
                  alignSelf: 'center',
                  marginRight: '0.5rem',
                }}
              />
              Fravær - Sykt barn
            </>
          </BodyShort>

          <BodyShort style={{ marginBottom: '0.5rem' }}>
            <>
              <ExclamationmarkTriangleFillIcon
                style={{
                  color: 'orange',
                  marginRight: '0.5rem',
                }}
              />
              Fravær - Velfærd
            </>
          </BodyShort>

          <BodyShort style={{ marginBottom: '0.5rem' }}>
            Antall dager med 75% utbetaling
          </BodyShort>
          <BodyShort style={{ marginBottom: '0.5rem' }}>
            Antall dager med 100% utbetaling
          </BodyShort>
        </Table.DataCell>
        <Table.DataCell>
          <BodyShort style={{ marginBottom: '0.5rem' }}>
            {antallDagerDeltatt.toString()}
          </BodyShort>
          <BodyShort style={{ marginBottom: '0.5rem' }}>
            {antallDagerIkkeDeltatt.toString()}
          </BodyShort>
          <BodyShort style={{ marginBottom: '0.5rem' }}>
            {antallDagerSyk.toString()}
          </BodyShort>
          <BodyShort style={{ marginBottom: '0.5rem' }}>
            {antallDagerSyktBarn.toString()}
          </BodyShort>
          <BodyShort style={{ marginBottom: '0.5rem' }}>
            {antallDagerVelferd.toString()}
          </BodyShort>
          <BodyShort style={{ marginBottom: '0.5rem' }}>
            {antallDager75prosent.toString()}
          </BodyShort>
          <BodyShort style={{ marginBottom: '0.5rem' }}>
            {antallDager100prosent.toString()}
          </BodyShort>
        </Table.DataCell>
        <Table.DataCell align="right">
          <div>
            <BodyShort style={{ marginBottom: '0.5rem' }}>&nbsp;</BodyShort>
            <BodyShort style={{ marginBottom: '0.5rem' }}>&nbsp;</BodyShort>
            <BodyShort style={{ marginBottom: '0.5rem' }}>&nbsp;</BodyShort>
            <BodyShort style={{ marginBottom: '0.5rem' }}>&nbsp;</BodyShort>
            <BodyShort style={{ marginBottom: '0.5rem' }}>&nbsp;</BodyShort>
            <BodyShort style={{ marginBottom: '0.5rem' }}>
              {sumAntallDager75prosent.toString()},-
            </BodyShort>
            <BodyShort style={{ marginBottom: '0.5rem' }}>
              {sumAntallDager100prosent.toString()},-
            </BodyShort>
          </div>
        </Table.DataCell>
      </Table.Row>
      <Table.Row>
        <Table.HeaderCell>Beløp til utbetaling</Table.HeaderCell>
        <Table.DataCell />
        <Table.DataCell align="right">
          <BodyShort>
            {(sumAntallDager100prosent + sumAntallDager75prosent).toString()},-
          </BodyShort>
        </Table.DataCell>
      </Table.Row>
    </Table>
  );
};
