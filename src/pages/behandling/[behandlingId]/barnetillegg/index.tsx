import { VStack, Loader, List } from '@navikt/ds-react';
import { useRouter } from 'next/router';
import { useHentBehandling } from '../../../../hooks/useHentBehandling';
import { BehandlingLayout } from '../../../../components/layout/BehandlingLayout';
import { SaksbehandlingLayout } from '../../../../components/layout/SaksbehandlingLayout';
import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../../_app';
import { Saksdialog } from '../../../../components/saksdialog/Saksdialog';
import Barnetillegg from '../../../../components/barnetillegg/Barnetillegg';
import { Skuff } from '../../../../components/skuff/Skuff';
import Link from 'next/link';
import { pageWithAuthentication } from '../../../../auth/pageWithAuthentication';

const Behandling: NextPageWithLayout = () => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  return (
    <>
      <Skuff venstreOrientert headerTekst={'Barn'}>
        <VStack style={{ padding: '1em' }}>
          <List>
            <List.Item>
              <Link href="/">Ole Duck</Link>
            </List.Item>
          </List>
        </VStack>
      </Skuff>
      <Barnetillegg />
      <Saksdialog endringslogg={valgtBehandling.endringslogg} />
    </>
  );
};

Behandling.getLayout = function getLayout(page: ReactElement) {
  return (
    <SaksbehandlingLayout>
      <BehandlingLayout>{page}</BehandlingLayout>
    </SaksbehandlingLayout>
  );
};

export const getServerSideProps = pageWithAuthentication();

export default Behandling;
