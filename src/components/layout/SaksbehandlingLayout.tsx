import { useRouter } from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import PersonaliaHeader from '../header/PersonaliaHeader';
import { SaksbehandlingTabs } from '../saksbehandling-tabs/SaksbehandlingTabs';
import { Loader } from '@navikt/ds-react';

export const SaksbehandlingLayout = ({ children }: React.PropsWithChildren) => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  return (
    <>
      <PersonaliaHeader valgtBehandling={valgtBehandling} />
      <SaksbehandlingTabs behandlingId={valgtBehandling.behandlingId} />
      {children}
    </>
  );
};
