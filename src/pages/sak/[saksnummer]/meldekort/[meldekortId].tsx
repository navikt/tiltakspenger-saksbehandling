import {
  Button,
  CopyButton,
  HStack,
  Loader,
  Tag,
  VStack,
} from '@navikt/ds-react';
import { pageWithAuthentication } from '../../../../auth/pageWithAuthentication';
import Meldekortdetaljer from '../../../../components/meldekort/meldekortdetaljer/Meldekortdetaljer';
import { Meldekortside } from '../../../../components/meldekort/meldekortside/Meldekortside';
import styles from '../../../behandling/Behandling.module.css';
import { NextPageWithLayout } from '../../../_app';
import { SakContext, SakLayout } from '../../../../components/layout/SakLayout';
import { ReactElement, useContext } from 'react';
import PersonaliaHeader from '../../../../components/personaliaheader/PersonaliaHeader';
import router from 'next/router';
import { finnMeldekortstatusTekst } from '../../../../utils/tekstformateringUtils';
import { useHentMeldekort } from '../../../../hooks/meldekort/useHentMeldekort';
import Varsel from '../../../../components/varsel/Varsel';

const Meldekort: NextPageWithLayout = () => {
  const { sakId, saknummer } = useContext(SakContext);
  const meldekortId = router.query.meldekortId as string;
  const { meldekort, error, isLoading } = useHentMeldekort(meldekortId, sakId);

  if (error) {
    console.log(error.message);
    return <Varsel variant="error" melding={error.message} />;
  }
  if (isLoading || !meldekort) return <Loader />;
  return (
    <VStack>
      <PersonaliaHeader sakId={sakId}>
        <b>Saksnr:</b> {saknummer}
        <CopyButton copyText={saknummer} variant="action" size="small" />
        <Button
          type="submit"
          size="small"
          onClick={() => router.push(`/sak/${saknummer}`)}
        >
          Tilbake til saksoversikt
        </Button>
        <Tag variant="alt3-filled" className={styles.behandlingTag}>
          {finnMeldekortstatusTekst(meldekort.status)}
        </Tag>
      </PersonaliaHeader>
      <HStack wrap={false} className={styles.behandlingLayout}>
        <Meldekortdetaljer />
        <Meldekortside />
      </HStack>
    </VStack>
  );
};

Meldekort.getLayout = function getLayout(page: ReactElement) {
  return <SakLayout>{page}</SakLayout>;
};

export const getServerSideProps = pageWithAuthentication();

export default Meldekort;
