import { HStack, BodyShort, Loader, VStack, Button } from '@navikt/ds-react';
import { ukeHeading } from '../../../utils/date';
import { Utbetalingsuke } from './Utbetalingsuke';
import router from 'next/router';
import { useContext, useRef } from 'react';
import { useHentMeldekort } from '../../../hooks/meldekort/useHentMeldekort';
import { SakContext } from '../../layout/SakLayout';
import Varsel from '../../varsel/Varsel';
import styles from './Meldekort.module.css';
import { useGodkjennMeldekort } from '../../../hooks/meldekort/useGodkjennMeldekort';
import { kanBeslutteForBehandling } from '../../../utils/tilganger';
import { SaksbehandlerContext } from '../../../pages/_app';
import BekreftelsesModal from '../../bekreftelsesmodal/BekreftelsesModal';

const Meldekortoppsummering = () => {
  const { sakId, saknummer } = useContext(SakContext);
  const meldekortId = router.query.meldekortId as string;
  const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);
  const { meldekort, isLoading, error } = useHentMeldekort(meldekortId, sakId);
  const {
    onGodkjennMeldekort,
    isMeldekortMutating,
    reset,
    feilVedGodkjenning,
  } = useGodkjennMeldekort(meldekortId, sakId, saknummer);

  const modalRef = useRef(null);

  const lukkModal = () => {
    modalRef.current.close();
    reset();
  };

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
  //B: Må endre denne til å ta inn beslutter på meldekortet når vi har lagt til tildeling.
  const kanBeslutte = kanBeslutteForBehandling(
    meldekort.status,
    innloggetSaksbehandler,
    meldekort.saksbehandler,
    innloggetSaksbehandler.navIdent,
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
      <HStack gap="5" className={styles.totalbeløp}>
        <BodyShort weight="semibold">Totalt beløp for perioden:</BodyShort>
        <BodyShort weight="semibold">
          {meldekort.totalbeløpTilUtbetaling},-
        </BodyShort>
      </HStack>
      <HStack gap="5" className={styles.totalbeløp}>
        <BodyShort weight="semibold">
          Navkontor det skal utbetales fra:
        </BodyShort>
        <BodyShort weight="semibold">{meldekort.navkontor.kontornummer} {meldekort.navkontor.kontornavn}</BodyShort>
      </HStack>
      {kanBeslutte && (
        <>
          <HStack justify="start" gap="3" align="end">
            <Button
              size="small"
              loading={isMeldekortMutating}
              onClick={() => modalRef.current?.showModal()}
            >
              Godkjenn meldekort
            </Button>
          </HStack>
          <BekreftelsesModal
            modalRef={modalRef}
            tittel={'Godkjenn meldekortet'}
            body={
              'Er du sikker på at meldekortet er korrekt og ønsker å sende det til utbetaling?'
            }
            error={feilVedGodkjenning}
            lukkModal={lukkModal}
          >
            <Button
              size="small"
              loading={isMeldekortMutating}
              onClick={() => onGodkjennMeldekort()}
            >
              Godkjenn meldekort
            </Button>
          </BekreftelsesModal>
        </>
      )}
    </>
  );
};

export default Meldekortoppsummering;
