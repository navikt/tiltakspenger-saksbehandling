import { BodyShort, Heading, HStack, Loader, VStack } from '@navikt/ds-react';
import React from 'react';
import { Utbetalingsuke } from './Utbetalingsuke';
import Varsel from '../../varsel/Varsel';
import { useHentUtbetalingVedtak } from '../../../hooks/utbetaling/useHentUtbetalingVedtak';
import router from 'next/router';
import { utbetalingsukeHeading } from '../../../utils/date';
import styles from './Utbetaling.module.css';

export const Utbetalingsside = () => {
  const utbetalingVedtakId = router.query.utbetalingId as string;
  const { utbetalingVedtak, isLoading, error } =
    useHentUtbetalingVedtak(utbetalingVedtakId);

  if (isLoading) return <Loader />;
  else if (error)
    return (
      <Varsel
        variant="error"
        melding={`Kunne ikke hente utbetaling (${error.status} ${error.info})`}
      />
    );

  const uke1 = utbetalingVedtak.vedtakDager.slice(0, 7);
  const uke2 = utbetalingVedtak.vedtakDager.slice(7, 14);

  return (
    <VStack gap="5" className={styles.utbetalingside}>
      <Heading size="small" level="3">
        {utbetalingsukeHeading(utbetalingVedtak.fom)}
      </Heading>
      <Utbetalingsuke utbetalingUke={uke1} />
      <Heading size="small" level="3">
        {utbetalingsukeHeading(utbetalingVedtak.tom)}
      </Heading>
      <Utbetalingsuke utbetalingUke={uke2} />
      <HStack gap="10" className={styles.total_utbetaling}>
        <BodyShort weight="semibold">Totalt utbetalt for perioden:</BodyShort>
        <BodyShort weight="semibold">{utbetalingVedtak.totalbeløp},-</BodyShort>
      </HStack>
    </VStack>
  );
};
