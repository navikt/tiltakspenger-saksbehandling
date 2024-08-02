import styles from './Meldekort.module.css';
import { MeldekortUke } from './MeldekortUke';
import { MeldekortBeregningsvisning } from '../meldekort-beregning-visning/MeldekortBeregningsVisning';
import { Alert, HStack, Loader, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { MeldekortKnapper } from './MeldekortKnapper';
import router from 'next/router';
import { ukenummerFraDate } from '../../../utils/date';
import { useHentMeldekort } from '../../../hooks/meldekort/useHentMeldekort';
import Varsel from '../../varsel/Varsel';

export const MeldekortSide = () => {
  const [disableUkeVisning, setDisableUkeVisning] = useState<boolean>(true);
  const meldekortId = router.query.meldekortId as string;
  const { meldekort, isLoading, error } = useHentMeldekort(meldekortId);

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
      <HStack
        gap="9"
        wrap={false}
        className={disableUkeVisning ? styles.disableUkevisning : ''}
      >
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
