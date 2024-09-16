import { VStack, BodyShort, Loader } from '@navikt/ds-react';
import styles from './Meldekortdetaljer.module.css';
import router from 'next/router';
import { useHentMeldekort } from '../../../hooks/meldekort/useHentMeldekort';
import { periodeTilFormatertDatotekst } from '../../../utils/date';
import { useContext } from 'react';
import { SakContext } from '../../layout/SakLayout';

const Meldekortdetaljer = () => {
  const { sakId } = useContext(SakContext);
  const meldekortId = router.query.meldekortId as string;
  const { meldekort, isLoading } = useHentMeldekort(meldekortId, sakId);

  if (isLoading || !meldekort) {
    return <Loader />;
  }

  const { periode, saksbehandler, beslutter, tiltakstype } = meldekort;

  return (
    <>
      <VStack gap="3" className={styles.wrapper}>
        <BodyShort>
          <b>Periode: </b>
        </BodyShort>
        <BodyShort>{periodeTilFormatertDatotekst(periode)}</BodyShort>
        <BodyShort>
          <b>Tiltak</b>
        </BodyShort>
        <BodyShort>{tiltakstype}</BodyShort>
        <BodyShort>
          <b>Utfylt av: </b>
        </BodyShort>
        <BodyShort>{saksbehandler ?? '-'}</BodyShort>
        <BodyShort>
          <b>Godkjent av: </b>
        </BodyShort>
        <BodyShort>{beslutter ?? '-'}</BodyShort>
      </VStack>
    </>
  );
};

export default Meldekortdetaljer;
