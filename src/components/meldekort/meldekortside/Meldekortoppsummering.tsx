import { HStack, BodyShort, Loader, VStack, Button } from '@navikt/ds-react';
import { ukeHeading } from '../../../utils/date';
import { Utbetalingsuke } from './Utbetalingsuke';
import router from 'next/router';
import { useContext } from 'react';
import { useHentMeldekort } from '../../../hooks/meldekort/useHentMeldekort';
import { SakContext } from '../../layout/SakLayout';
import Varsel from '../../varsel/Varsel';
import styles from './Meldekort.module.css';
import { useGodkjennMeldekort } from '../../../hooks/meldekort/useGodkjennMeldekort';
import { kanBeslutteForBehandling } from '../../../utils/tilganger';
import { SaksbehandlerContext } from '../../../pages/_app';

const Meldekortoppsummering = () => {
  const { sakId } = useContext(SakContext);
  const meldekortId = router.query.meldekortId as string;
  const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);
  const { meldekort, isLoading, error } = useHentMeldekort(meldekortId, sakId);
  const { onGodkjennMeldekort, isMeldekortMutating } = useGodkjennMeldekort(
    meldekortId,
    sakId,
  );

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

  const kanBeslutte = kanBeslutteForBehandling(
    meldekort.status,
    innloggetSaksbehandler,
    meldekort.saksbehandler,
  );

  const uke1 = meldekort.meldekortDager.slice(0, 7);
  const uke2 = meldekort.meldekortDager.slice(7, 14);

  return (
    <>
      <Utbetalingsuke
        utbetalingUke={uke1}
        headingtekst={ukeHeading(meldekort.periode.fraOgMed)}
      />
      <Utbetalingsuke
        utbetalingUke={uke2}
        headingtekst={ukeHeading(meldekort.periode.tilOgMed)}
      />
      <HStack gap="10" className={styles.totalbeløp}>
        <BodyShort weight="semibold">Totalt beløp for perioden:</BodyShort>
        <BodyShort weight="semibold">
          {meldekort.totalbeløpTilUtbetaling},-
        </BodyShort>
      </HStack>
      {kanBeslutte && (
        <Button
          size="small"
          loading={isMeldekortMutating}
          onClick={() => onGodkjennMeldekort()}
        >
          Godkjenn meldekort
        </Button>
      )}
    </>
  );
};

export default Meldekortoppsummering;
