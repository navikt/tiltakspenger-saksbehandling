import { useRouter } from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import PersonaliaHeader from '../header/PersonaliaHeader';
import { SaksbehandlingTabs } from '../saksbehandling-tabs/SaksbehandlingTabs';
import { Loader } from '@navikt/ds-react';
import { createContext, useEffect, useState } from 'react';

interface BehandlingContextType {
  behandlingId: string;
}

export const BehandlingContext = createContext<BehandlingContextType>({
  behandlingId: '',
});

export const SaksbehandlingLayout = ({ children }: React.PropsWithChildren) => {
  const router = useRouter();
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);
  const [id, settId] = useState<string>('');

  useEffect(() => {
    if (valgtBehandling) {
      settId(valgtBehandling.behandlingId);
    }
  }, [valgtBehandling]);

  if (isLoading || !valgtBehandling) {
    return <Loader />;
  }

  return (
    <BehandlingContext.Provider value={{ behandlingId: id }}>
      <PersonaliaHeader />
      <SaksbehandlingTabs />
      <main>{children}</main>
    </BehandlingContext.Provider>
  );
};
