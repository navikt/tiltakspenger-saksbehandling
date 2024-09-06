import { VStack, BodyShort, Loader, Heading } from '@navikt/ds-react';
import styles from './Meldekortdetaljer.module.css';

import router from 'next/router';
import { useHentMeldekort } from '../../../hooks/meldekort/useHentMeldekort';
import { periodeTilFormatertDatotekst } from '../../../utils/date';

const Meldekortdetaljer = () => {
  const meldekortId = router.query.meldekortId as string;
  const sakId = router.query.sakId as string;
  const { meldekort, isLoading, error } = useHentMeldekort(meldekortId, sakId);

  if (isLoading || !meldekort) {
    return <Loader />;
  }

  const { fraOgMed, tilOgMed, antallDagerPåTiltaket } = meldekort;

  return (
    <>
      <VStack gap="3" className={styles.wrapper}>
        <Heading size="small">Detaljer</Heading>
        <BodyShort>
          <b>Periode: </b>
        </BodyShort>
        <BodyShort>
          {periodeTilFormatertDatotekst({
            fraOgMed: fraOgMed,
            tilOgMed: tilOgMed,
          })}
        </BodyShort>
        <BodyShort>
          <b>Antall dager på tiltak</b>
        </BodyShort>
        <BodyShort>{antallDagerPåTiltaket}</BodyShort>
      </VStack>
    </>
  );
};

export default Meldekortdetaljer;
