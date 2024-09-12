import styles from './Meldekort.module.css';
import { MeldekortUke } from './MeldekortUke';
import { BodyShort, Heading, HStack, Loader, VStack } from '@navikt/ds-react';
import { MeldekortKnapper } from './MeldekortKnapper';
import router from 'next/router';
import { useHentMeldekort } from '../../../hooks/meldekort/useHentMeldekort';
import Varsel from '../../varsel/Varsel';
import { meldekortHeading, ukeHeading } from '../../../utils/date';
import { Meldekortstatus } from '../../../types/MeldekortTypes';
import { Utbetalingsuke } from './Utbetalingsuke';

export const MeldekortSide = () => {
  const sakId = router.query.sakId as string;
  const meldekortId = router.query.meldekortId as string;
  const { meldekort, isLoading, error } = useHentMeldekort(meldekortId, sakId);

  if (isLoading && !meldekort) {
    return <Loader />;
  } else if (error) {
    return (
      <VStack className={styles.wrapper}>
        <Varsel
          variant="error"
          melding={`Kunne ikke hente meldekort (${error.status} ${error.info})`}
        />
      </VStack>
    );
  }

  const uke1 = meldekort.meldekortDager.slice(0, 7);
  const uke2 = meldekort.meldekortDager.slice(7, 14);

  return (
    <VStack gap="5" className={styles.wrapper}>
      <Heading level="2" size="medium">
        {meldekortHeading(meldekort.periode)}
      </Heading>
      {meldekort.status != Meldekortstatus.KLAR_TIL_UTFYLLING ? (
        <>
          <Heading size="small" level="3">
            {ukeHeading(meldekort.periode.fraOgMed)}
          </Heading>
          <Utbetalingsuke utbetalingUke={uke1} />
          <Heading size="small" level="3">
            {ukeHeading(meldekort.periode.tilOgMed)}
          </Heading>
          <Utbetalingsuke utbetalingUke={uke2} />
          <HStack gap="10" className={styles.totalbeløp}>
            <BodyShort weight="semibold">Totalt beløp for perioden:</BodyShort>
            <BodyShort weight="semibold">
              {meldekort.totalbeløpTilUtbetaling},-
            </BodyShort>
          </HStack>
        </>
      ) : (
        <>
          <HStack gap="9" wrap={false}>
            <MeldekortUke
              meldekortUke={uke1}
              heading={ukeHeading(meldekort.periode.fraOgMed)}
              meldekortId={meldekortId}
              sakId={sakId}
            />
            <MeldekortUke
              meldekortUke={uke2}
              heading={ukeHeading(meldekort.periode.tilOgMed)}
              meldekortId={meldekortId}
              sakId={sakId}
            />
          </HStack>
        </>
      )}
      <MeldekortKnapper
        meldekortdager={meldekort.meldekortDager}
        meldekortId={meldekortId}
        sakId={sakId}
      />
    </VStack>
  );
};
