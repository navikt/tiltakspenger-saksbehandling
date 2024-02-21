import {BodyLong, Heading, Loader, Table} from '@navikt/ds-react';
import React from 'react';
import {useRouter} from 'next/router';
import {UtbetalingUkeDag} from "./UtbetalingUkeDag";
import {useHentUtbetalingVedtak} from "../../hooks/useHentUtbetalingVedtak";
import {UtbetalingsDagStatus} from "../../types/Utbetaling";

export const UtbetalingSide = () => {
  const router = useRouter();
  const utbetalingVedtakId = router.query.utbetalingId as string;
  const { utbetalingVedtak, isLoading } = useHentUtbetalingVedtak(utbetalingVedtakId);

    if (isLoading) {
        return <Loader />;
    } else if( !utbetalingVedtak) {
        return <BodyLong style={{padding: '1rem', margin:'0.5rem'}}>
                    Ingen utbetaling vedtak til å vise
               </BodyLong>;
    }

    /*const utbetalingsDagDTO = [
        {
            beløp: 505,
            dato: new Date('2024-01-01'),
            tiltakType: 'String',
            status: UtbetalingsDagStatus.FullUtbetaling
        },
        {
            beløp: 505,
            dato: new Date('2024-01-02'),
            tiltakType: 'String',
            status: UtbetalingsDagStatus.FullUtbetaling
        },
        {
            beløp: 505,
            dato: new Date('2024-01-03'),
            tiltakType: 'String',
            status: UtbetalingsDagStatus.FullUtbetaling
        },
        {
            beløp: 505,
            dato: new Date('2024-01-04'),
            tiltakType: 'String',
            status: UtbetalingsDagStatus.FullUtbetaling
        },
        {
            beløp: 505,
            dato: new Date('2024-01-05'),
            tiltakType: 'String',
            status: UtbetalingsDagStatus.FullUtbetaling
        },
        {
            beløp: 0,
            dato: new Date('2024-01-06'),
            tiltakType: 'String',
            status: UtbetalingsDagStatus.IngenUtbetaling
        },
        {
            beløp: 0,
            dato: new Date('2024-01-07'),
            tiltakType: 'String',
            status: UtbetalingsDagStatus.IngenUtbetaling
        },
        {
            beløp: 373,
            dato: new Date('2024-01-08'),
            tiltakType: 'String',
            status: UtbetalingsDagStatus.DelvisUtbetaling
        }]

    utbetalingVedtak = {
        id: '123',
        fom: new Date('2024-01-01'),
        tom: new Date('2023-01-14'),
        sats:  285,
        satsBarnetillegg: 53,
        antallBarn: 4,
        totalbeløp: 7580,
        vedtakDager: utbetalingsDagDTO
    }*/

    const uke1 = utbetalingVedtak.vedtakDager.slice(0, 7);
    const uke2 = utbetalingVedtak.vedtakDager.slice(7, 14);

  return (
      <Table zebraStripes style={{ width: '98%', margin: '1rem'}}>
          <Table.Header>
              <Table.Row>
                  <Table.HeaderCell scope="col" style={{ margin: '1rem'}}>Dag</Table.HeaderCell>
                  <Table.HeaderCell scope="col">Dato</Table.HeaderCell>
                  <Table.HeaderCell scope="col">Utbetaling</Table.HeaderCell>
                  <Table.HeaderCell scope="col">Beløp</Table.HeaderCell>
              </Table.Row>
          </Table.Header>
          <Table.Body>
              <UtbetalingUkeDag
                  utbetalingUke={uke1}
              />
              <UtbetalingUkeDag
                  utbetalingUke={uke2}
              />
          </Table.Body>
      </Table>
  );
};
