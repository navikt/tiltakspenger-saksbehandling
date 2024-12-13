import router from 'next/router';
import { useHentBehandling } from '../../hooks/useHentBehandling';
import PersonaliaHeader from '../personaliaheader/PersonaliaHeader';
import { Saksbehandlingstabs } from '../saksbehandlingstabs/SaksbehandlingTabs';
import { CopyButton, Loader, Tag } from '@navikt/ds-react';
import { createContext, useEffect, useState } from 'react';
import { finnStatusTekst } from '../../utils/tekstformateringUtils';
import { TypeBehandling } from '../../types/BehandlingTypes';
import { Periode } from '../../types/Periode';

interface BehandlingContextType {
  behandlingId: string;
  sakId: string;
  behandlingstype: TypeBehandling;
  behandlingsperiode: Periode;
}

export const BehandlingContext = createContext<BehandlingContextType>({
  behandlingId: undefined,
  sakId: undefined,
  behandlingstype: undefined,
  behandlingsperiode: undefined,
});

export const FørstegangsbehandlingLayout = ({
  children,
}: React.PropsWithChildren) => {
  const behandlingId = router.query.behandlingId as string;
  const { valgtBehandling, isLoading } = useHentBehandling(behandlingId);

  const [behId, settBehId] = useState<string>(undefined);
  const [sakenId, settSakenId] = useState<string>(undefined);
  const [type, settType] = useState<TypeBehandling>(undefined);
  const [periode, settPeriode] = useState<Periode>(undefined);

  useEffect(() => {
    if (valgtBehandling) {
      settBehId(valgtBehandling.id);
      settSakenId(valgtBehandling.sakId);
      settType(valgtBehandling.behandlingstype);
      settPeriode(valgtBehandling.vurderingsperiode);
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
        behandlingstype: type,
        behandlingsperiode: periode,
      }}
    >
      <PersonaliaHeader sakId={sakenId} saksnummer={valgtBehandling.saksnummer}>
        <Tag variant="alt3-filled">
          {finnStatusTekst(valgtBehandling.status, false)}
        </Tag>
      </PersonaliaHeader>
      <Saksbehandlingstabs />
      <main>{children}</main>
    </BehandlingContext.Provider>
  );
};
