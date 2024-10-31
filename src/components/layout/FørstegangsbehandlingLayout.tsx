import router from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import PersonaliaHeader from '../personaliaheader/PersonaliaHeader';
import { Saksbehandlingstabs } from '../saksbehandlingstabs/SaksbehandlingTabs';
import { CopyButton, Loader, Tag } from '@navikt/ds-react';
import { createContext, useEffect, useState } from 'react';
import { finnStatusTekst } from '../../utils/tekstformateringUtils';

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
      <PersonaliaHeader sakId={sakenId}>
        <b>Saksnr:</b> {valgtBehandling.saksnummer}
        <CopyButton
          copyText={valgtBehandling.saksnummer}
          variant="action"
          size="small"
        />
        <Tag variant="alt3-filled">
          {finnStatusTekst(valgtBehandling.status, false)}
        </Tag>
      </PersonaliaHeader>
      <Saksbehandlingstabs />
      <main>{children}</main>
    </BehandlingContext.Provider>
  );
};
