import styles from './Meldekort.module.css';
import { MeldekortUke } from '../meldekort-side/MeldekortUke';
import { MeldekortBeregningsvisning } from '../meldekort-beregning-visning/MeldekortBeregningsVisning';
import { HStack, Loader, Spacer, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { MeldekortKnapper } from './MeldekortKnapper';
import { useRouter } from 'next/router';
import { useHentMeldekort } from '../../hooks/useHentMeldekort';
import { MeldekortDagDTO } from '../../types/MeldekortTypes';
import { useSWRConfig } from 'swr';

export const MeldekortSide = () => {
  const [disableUkeVisning, setDisableUkeVisning] = useState<boolean>(true);
  const router = useRouter();
  const mutator = useSWRConfig().mutate;
  const meldekortId = router.query.meldekortId as string;
  const { meldekort, isLoading } = useHentMeldekort(meldekortId);

  if (isLoading || !meldekort) {
    return <Loader />;
  }

  const oppdaterMeldekortUkeDag = (meldekortDagDTO: MeldekortDagDTO) => {
      fetch(`/api/meldekort/oppdaterDag`, {
        method: 'POST',
        body: JSON.stringify(meldekortDagDTO),
      }).then(() => {
          mutator(`/api/meldekort`);
        })
    };

  const godkjennMeldekort = () => {
    setDisableUkeVisning(true);
  };

  return (
    <VStack gap="5" className={styles.ukevisning}>
      <HStack
      className={disableUkeVisning? styles.disableUkevisning : ''}
      >
        <MeldekortUke
          meldekortUke={meldekort.meldekortDager.slice(0, 7)}
          ukesnummer={1}
          meldekortId={meldekortId}
          handleOppdaterMeldekort={(meldekortDagDTO) => oppdaterMeldekortUkeDag(meldekortDagDTO)}
        />
        <Spacer />
        <MeldekortUke
          meldekortUke={meldekort.meldekortDager.slice(7, 14)}
          ukesnummer={2}
          meldekortId={meldekortId}
          handleOppdaterMeldekort={(meldekortDagDTO) => oppdaterMeldekortUkeDag(meldekortDagDTO)}
        />
      </HStack>
      <MeldekortBeregningsvisning meldekort={meldekort} />
      <MeldekortKnapper
        håndterEndreMeldekort={() => setDisableUkeVisning(!disableUkeVisning)}
        håndterGodkjennMeldekort={godkjennMeldekort}
      />
    </VStack>
  );
};
