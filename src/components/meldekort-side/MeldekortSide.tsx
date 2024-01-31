import styles from './Meldekort.module.css';
import { MeldekortUke } from '../meldekort-side/MeldekortUke';
import { MeldekortBeregningsvisning } from '../meldekort-beregning-visning/MeldekortBeregningsVisning';
import { HStack, Loader, Spacer, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { MeldekortKnapper } from './MeldekortKnapper';
import { useRouter } from 'next/router';
import { useHentMeldekort } from '../../hooks/useHentMeldekort';

export const MeldekortSide = () => {
  const [disableUkeVisning, setDisableUkeVisning] = useState<boolean>(false);
  const router = useRouter()
  const meldekortId = router.query.meldekortId as string
  const { meldekort, isLoading } = useHentMeldekort(meldekortId)

  if (isLoading || !meldekort) {
    return <Loader />;
  }

  const godkjennMeldekort = () => {
    setDisableUkeVisning(true);
  };

  return (
    <VStack gap="5" style={{ margin: '1em' }}>
      <HStack
        className={
          disableUkeVisning ? styles.disableUkevisning : styles.ukevisning
        }
      >
        <MeldekortUke
          meldekortUke={meldekort.meldekortDager.slice(0, 7)}
          ukesnummer={1}
          fom={1}
          tom={7}
          ukeNr={1}
          handleOppdaterMeldekort={() => console.log("knapptrykk uke 1")}
        />
        <Spacer />
        <MeldekortUke
          meldekortUke={meldekort.meldekortDager.slice(7, 14)}
          ukesnummer={2}
          fom={8}
          tom={14}
          ukeNr={2}
          handleOppdaterMeldekort={() => console.log("knapptrykk uke 2")}
        />
      </HStack>
      <MeldekortBeregningsvisning
        meldekort={meldekort}
      />
      <MeldekortKnapper
        håndterEndreMeldekort={() => setDisableUkeVisning(!disableUkeVisning)}
        håndterGodkjennMeldekort={godkjennMeldekort}
      />
    </VStack>
  );
};
