import styles from './Meldekort.module.css';
import { MeldekortUke } from './MeldekortUke';
import { MeldekortBeregningsvisning } from '../meldekort-beregning-visning/MeldekortBeregningsVisning';
import { BodyLong, HStack, Loader, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { MeldekortKnapper } from './MeldekortKnapper';
import router from 'next/router';
import { ukenummerFraDate } from '../../../utils/date';
import { useHentMeldekort } from '../../../hooks/meldekort/useHentMeldekort';

export const MeldekortSide = () => {
  const [disableUkeVisning, setDisableUkeVisning] = useState<boolean>(true);
  const meldekortId = router.query.meldekortId as string;
  const { meldekort, isLoading } = useHentMeldekort(meldekortId);

  if (isLoading || !meldekort) {
    return <Loader />;
  } else if (!meldekort) {
    return (
      <VStack className={styles.ukevisning}>
        <BodyLong>Meldekort har ikke blitt opprettet enda</BodyLong>
      </VStack>
    );
  }

  const uke1 = meldekort.meldekortDager.slice(0, 7);
  const uke2 = meldekort.meldekortDager.slice(7, 14);

  return (
    <VStack gap="5" className={styles.wrapper}>
      <HStack className={disableUkeVisning ? styles.disableUkevisning : ''}>
        <MeldekortUke
          meldekortUke={uke1}
          ukesnummer={ukenummerFraDate(uke1[0].dato)}
          meldekortId={meldekortId}
        />
        <MeldekortUke
          meldekortUke={uke2}
          ukesnummer={ukenummerFraDate(uke2[1].dato)}
          meldekortId={meldekortId}
        />
      </HStack>
      <MeldekortBeregningsvisning />
      <MeldekortKnapper
        meldekortId={meldekortId}
        håndterEndreMeldekort={() => setDisableUkeVisning(!disableUkeVisning)}
      />
    </VStack>
  );
};
