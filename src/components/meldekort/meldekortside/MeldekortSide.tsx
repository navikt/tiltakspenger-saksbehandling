import styles from './Meldekort.module.css';
import { MeldekortUke } from './MeldekortUke';
import { Heading, HStack, Loader, VStack } from '@navikt/ds-react';
import { MeldekortKnapper } from './MeldekortKnapper';
import router from 'next/router';
import { useHentMeldekort } from '../../../hooks/meldekort/useHentMeldekort';
import Varsel from '../../varsel/Varsel';
import { ukenummerFraDatotekst, ukenummerHeading } from '../../../utils/date';

export const MeldekortSide = () => {
  const sakId = router.query.sakId as string;
  const meldekortId = router.query.meldekortId as string;
  const { meldekort, isLoading, error } = useHentMeldekort(meldekortId, sakId);

  if (isLoading) {
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
        Meldekort {ukenummerHeading(meldekort.periode)}
      </Heading>
      <HStack gap="9" wrap={false}>
        <MeldekortUke
          meldekortUke={uke1}
          ukesnummer={ukenummerFraDatotekst(uke1[0].dato)}
          meldekortId={meldekortId}
        />
        <MeldekortUke
          meldekortUke={uke2}
          ukesnummer={ukenummerFraDatotekst(uke2[1].dato)}
          meldekortId={meldekortId}
        />
      </HStack>
      <MeldekortKnapper
        meldekortdager={meldekort.meldekortDager}
        meldekortId={meldekortId}
        sakId={sakId}
      />
    </VStack>
  );
};
