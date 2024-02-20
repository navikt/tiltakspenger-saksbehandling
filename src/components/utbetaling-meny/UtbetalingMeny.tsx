import { CardIcon } from '@navikt/aksel-icons';
import { Detail, Heading, Label, VStack } from '@navikt/ds-react';
import React from 'react';
import styles from './UtbetalingMeny.module.css';
import { getWeekNumber, formatPeriode } from '../../utils/date';
import IkonMedTekst from '../ikon-med-tekst/IkonMedTekst';
import { useRouter } from 'next/router';
import {useHentUtbetalingListe} from "../../hooks/useHentUtbetalingListe";
import {UtbetalingListe} from "../../types/Utbetaling";

interface UtbetalingmenyProps {
    behandlingId: string;
}

const utbetalingUkeNummer = (fom: Date, tom: Date): string => {
  return `Uke ${getWeekNumber(fom)} / ${getWeekNumber(tom)}`;
};

export const UtbetalingMeny = ({ behandlingId }: UtbetalingmenyProps) => {
  const { utbetalingListe } = useHentUtbetalingListe(behandlingId);
  const router = useRouter()

    const utbetalingListet : UtbetalingListe[] = [
        {
            id: '123',
            fom: new Date('2024-01-01'),
            tom: new Date('2023-01-14'),
            beløp: 7580,
        },
        {
            id: '124',
            fom: new Date('2023-01-15'),
            tom: new Date('2023-01-16'),
            beløp: 2459,
        }
    ]

  return (
    <VStack className={styles.section}>
      <Heading size="xsmall" level="1" className={styles.heading}>
        <IkonMedTekst
          text={'Utbetalinger'}
          iconRenderer={() => <CardIcon stroke="#22262A" />}
          weight="semibold"
        />
      </Heading>
      <div className={styles.utbetalingliste}>
        {utbetalingListet?.map((utbetaling: UtbetalingListe) => {
          return (
            <div key={utbetaling.id}
                 className={styles.listeelement}
                 onClick={() => router.push(`/behandling/${behandlingId}/utbetaling/${utbetaling.id}`)}
            >
              <Label size="small">
                {utbetalingUkeNummer(
                    utbetaling.fom,
                    utbetaling.tom
                )}
              </Label>
              <Detail>
                {formatPeriode({
                  fra: utbetaling.fom.toString(),
                  til: utbetaling.tom.toString(),
                })}
              </Detail>
                <Detail>Utbetalt: {utbetaling.beløp.toString()}</Detail>
            </div>
          );
        })}
      </div>
    </VStack>
  );
};
