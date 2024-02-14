import styles from './Meldekort.module.css';
import { MeldekortUke } from '../meldekort-side/MeldekortUke';
import { MeldekortBeregningsvisning } from '../meldekort-beregning-visning/MeldekortBeregningsVisning';
import { HStack, Loader, Spacer, VStack } from '@navikt/ds-react';
import {useContext, useState} from 'react';
import { MeldekortKnapper } from './MeldekortKnapper';
import { useRouter } from 'next/router';
import { useHentMeldekort } from '../../hooks/useHentMeldekort';
import { getWeekNumber } from '../../utils/date';
import {SaksbehandlerContext} from "../../pages/_app";

export const MeldekortSide = () => {
  const [disableUkeVisning, setDisableUkeVisning] = useState<boolean>(true);
  const router = useRouter();
  const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);

  const meldekortId = router.query.meldekortId as string;
  const { meldekort, isLoading } = useHentMeldekort(meldekortId);

  
  if (isLoading || !meldekort) {
    return <Loader />;
  }
  
  const uke1 = meldekort.meldekortDager.slice(0, 7)
  const uke2 = meldekort.meldekortDager.slice(7, 14)

  const godkjennMeldekort = () => {
    fetch(`/api/meldekort/godkjenn/${meldekortId}`, {
      method: 'POST',
      body: JSON.stringify({ saksbehandler: innloggetSaksbehandler?.navIdent }),
    });
    setDisableUkeVisning(true);
  };

  return (
    <VStack gap="5" className={styles.ukevisning}>
      <HStack
      className={disableUkeVisning? styles.disableUkevisning : ''}
      >
        <MeldekortUke
          meldekortUke={uke1}
          ukesnummer={getWeekNumber(uke1[0].dato)}
          meldekortId={meldekortId}
        />
        <Spacer />
        <MeldekortUke
          meldekortUke={uke2}
          ukesnummer={getWeekNumber(uke2[1].dato)}
          meldekortId={meldekortId}
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
