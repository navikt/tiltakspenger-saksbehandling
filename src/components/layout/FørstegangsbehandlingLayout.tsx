import router from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import PersonaliaHeader from '../personaliaheader/PersonaliaHeader';
import { Saksbehandlingstabs } from '../saksbehandlingstabs/SaksbehandlingTabs';
import { Button, Loader, Tag } from '@navikt/ds-react';
import { createContext, useContext, useEffect, useState } from 'react';
import { kanTaAvBehandling } from '../../utils/tilganger';
import { SaksbehandlerContext } from '../../pages/_app';
import { finnStatusTekst } from '../../utils/tekstformateringUtils';
import { useTaAvBehandling } from '../../hooks/useTaAvBehandling';

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
  const { innloggetSaksbehandler } = useContext(SaksbehandlerContext);
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);
  const { taAvBehandling, tarAvBehandling } = useTaAvBehandling(behandlingId);

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
  const { saksbehandler, beslutter, status } = valgtBehandling;

  return (
    <BehandlingContext.Provider
      value={{
        behandlingId: behId,
        sakId: sakenId,
      }}
    >
      <PersonaliaHeader behandlingId={behandlingId}>
        <>
          {kanTaAvBehandling(
            status,
            innloggetSaksbehandler,
            saksbehandler,
            beslutter,
          ) && (
            <Button
              type="submit"
              size="small"
              loading={tarAvBehandling}
              onClick={() => taAvBehandling()}
            >
              Ta av behandling
            </Button>
          )}
        </>
        <Tag variant="alt3-filled">
          {finnStatusTekst(valgtBehandling.status, false)}
        </Tag>
      </PersonaliaHeader>
      <Saksbehandlingstabs />
      <main>{children}</main>
    </BehandlingContext.Provider>
  );
};
