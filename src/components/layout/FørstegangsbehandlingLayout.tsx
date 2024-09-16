import router from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import PersonaliaHeader from '../personaliaheader/PersonaliaHeader';
import { Saksbehandlingstabs } from '../saksbehandlingstabs/SaksbehandlingTabs';
import { Loader } from '@navikt/ds-react';
import { createContext, useEffect, useState } from 'react';

interface BehandlingContextType {
  behandlingId: string;
  sakId: string;
}

export const BehandlingContext = createContext<BehandlingContextType>({
  behandlingId: undefined,
  sakId: undefined,
});

export const FørstegangsbehandlingLayout = ({
  children,
}: React.PropsWithChildren) => {
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  const [behId, settBehId] = useState<string>(undefined);
  const [sakenId, settSakenId] = useState<string>(undefined);

  useEffect(() => {
    if (valgtBehandling) {
      settBehId(valgtBehandling.id);
      settSakenId(valgtBehandling.sakId);
    }
  }, [valgtBehandling]);

  if (isLoading || !valgtBehandling || !behId) {
    return <Loader />;
  }
  return (
    <BehandlingContext.Provider
      value={{
        behandlingId: behId,
        sakId: sakenId,
      }}
    >
      <PersonaliaHeader />
      <Saksbehandlingstabs />
      <main>{children}</main>
    </BehandlingContext.Provider>
  );
};
