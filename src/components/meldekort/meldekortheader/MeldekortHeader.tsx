import React, { useContext } from 'react';
import {
  BodyShort,
  Button,
  HStack,
  Loader,
  Spacer,
  Tag,
} from '@navikt/ds-react';
import { CalendarIcon } from '@navikt/aksel-icons';
import styles from './MeldekortHeader.module.css';
import { finnMeldekortstatusTekst } from '../../../utils/tekstformateringUtils';
import { useHentMeldekort } from '../../../hooks/meldekort/useHentMeldekort';
import router from 'next/router';
import { SakContext } from '../../layout/SakLayout';

const MeldekortHeader = () => {
  const { sakId } = useContext(SakContext);
  const meldekortId = router.query.meldekortId as string;
  const { meldekort, isLoading } = useHentMeldekort(meldekortId, sakId);

  if (isLoading || !meldekort) return <Loader />;

  return (
    <HStack className={styles.header} gap="5" align="center">
      <CalendarIcon className={styles.ikon} />
      <BodyShort>{meldekortId}</BodyShort>
      <Spacer />
      <Button type="submit" size="small" onClick={() => router.back()}>
        Tilbake til oversikt
      </Button>

      <Tag variant="alt3-filled" className={styles.behandlingTag}>
        {finnMeldekortstatusTekst(meldekort.status)}
      </Tag>
    </HStack>
  );
};

export default MeldekortHeader;
