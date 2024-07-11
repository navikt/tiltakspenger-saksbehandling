import {
  BodyLong,
  BodyShort,
  Detail,
  HGrid,
  Loader,
  VStack,
} from '@navikt/ds-react';
import React from 'react';
import { useRouter } from 'next/router';
import { useHentUtbetalingVedtak } from '../../../hooks/useHentUtbetalingVedtak';
import styles from './Utbetaling.module.css';
import { UtbetalingUkeDag } from './UtbetalingUkeDag';

export const UtbetalingSide = () => {
  const router = useRouter();
  const utbetalingVedtakId = router.query.utbetalingId as string;
  const { utbetalingVedtak, isLoading } =
    useHentUtbetalingVedtak(utbetalingVedtakId);

  if (isLoading) {
    return <Loader />;
  } else if (!utbetalingVedtak) {
    return (
      <VStack className={styles.utbetalingSide}>
        <BodyLong>Ingen utbetalingsvedtak å vise</BodyLong>
      </VStack>
    );
  }

  const uke1 = utbetalingVedtak.vedtakDager.slice(0, 7);
  const uke2 = utbetalingVedtak.vedtakDager.slice(7, 14);

  return (
    <VStack gap="3" className={styles.utbetalingSide}>
      <div className={styles.utbetalingDagListeHeading}>
        <HGrid gap="12" columns={4} style={{ margin: '0 0.5rem' }}>
          <BodyShort weight="semibold">Dag</BodyShort>
          <BodyShort weight="semibold">Dato</BodyShort>
          <BodyShort weight="semibold">Utbetaling</BodyShort>
          <BodyShort weight="semibold">Beløp</BodyShort>
        </HGrid>
      </div>
      <UtbetalingUkeDag utbetalingUke={uke1} />
      <UtbetalingUkeDag utbetalingUke={uke2} />
      <div className={styles.utbetalingDagliste}>
        <div className={styles.utbetalingDagListeGrid}>
          <HGrid gap="12" columns={4}>
            <BodyShort weight="semibold">Total til utbetaling</BodyShort>
            <span></span>
            <span></span>
            <Detail truncate>{utbetalingVedtak.totalbeløp}</Detail>
          </HGrid>
        </div>
      </div>
    </VStack>
  );
};
