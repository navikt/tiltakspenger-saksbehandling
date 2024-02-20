import styles from './Utbetaling.module.css';
import { MeldekortBeregningsvisning } from '../meldekort-beregning-visning/MeldekortBeregningsVisning';
import {HStack, Loader, Spacer, Table, VStack} from '@navikt/ds-react';
import React, {useContext, useState} from 'react';
import { MeldekortKnapper } from './MeldekortKnapper';
import { useRouter } from 'next/router';
import { getWeekNumber } from '../../utils/date';
import {SaksbehandlerContext} from "../../pages/_app";
import {useHentUtbetalingVedtak} from "../../hooks/useHentUtbetalingVedtak";
import {UtbetalingUkeVisning} from "./UtbetalingUkeVisning";
import {UtbetalingUkeDag} from "./UtbetalingUkeDag";
import {UtbetalingsDagDTO, UtbetalingsDagStatus} from "../../types/Utbetaling";

export const UtbetalingSide = () => {
  const router = useRouter();
  const utbetalingVedtakId = router.query.utbetalingId as string;
  const { utbetalingVedtak, isLoading } = useHentUtbetalingVedtak(utbetalingVedtakId);

  if (isLoading || !utbetalingVedtak) {
    return <Loader />;
  }


    const utbetalingsDagDTO = {
        beløp: 7580,
        dato: new Date('2024-01-01'),
        tiltakType: 'String',
        status: UtbetalingsDagStatus.FullUtbetaling
    }

    const UtbetalingVedtak = {
        id: '123',
        fom: new Date('2024-01-01'),
        tom: new Date('2023-01-14'),
        sats:  285,
        satsBarnetillegg: 53,
        antallBarn: 4,
        totalbeløp: 7580,
        vedtakDager: [utbetalingsDagDTO]
    }

  const uke1 = utbetalingVedtak.vedtakDager.slice(0, 7)
  const uke2 = utbetalingVedtak.vedtakDager.slice(7, 14)

  return (
      <Table zebraStripes>
          <Table.Header>
              <Table.Row>
                  <Table.HeaderCell scope="col">Dag</Table.HeaderCell>
                  <Table.HeaderCell scope="col">Dato.</Table.HeaderCell>
                  <Table.HeaderCell scope="col">Utbetaling</Table.HeaderCell>
                  <Table.HeaderCell scope="col">Beløp</Table.HeaderCell>
              </Table.Row>
          </Table.Header>
          <Table.Body>

          </Table.Body>
      </Table>
  );
};
